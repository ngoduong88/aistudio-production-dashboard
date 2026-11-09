import * as XLSX from 'xlsx';
import { ProductionRecord, ShiftType, LineStatus } from '../types';

export const parseSpreadsheetFile = async (file: File): Promise<ProductionRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          throw new Error('Spreadsheet appears to be empty.');
        }

        const parsedRecords: ProductionRecord[] = rawJson.map((row, index) => {
          // Normalize column keys
          const keys = Object.keys(row);
          const findVal = (patterns: string[]): any => {
            const matchKey = keys.find((k) =>
              patterns.some((p) => k.toLowerCase().replace(/[^a-z0-9]/g, '').includes(p.toLowerCase()))
            );
            return matchKey ? row[matchKey] : undefined;
          };

          const lineId = String(findVal(['lineid', 'line', 'cell', 'unit']) || `Line-${index + 1}`).trim();
          const station = String(findVal(['station', 'process', 'operation', 'step']) || 'General Operation').trim();
          const shiftRaw = String(findVal(['shift', 'turn']) || 'Shift 1 (Day)').trim();
          const shift: ShiftType = shiftRaw.toLowerCase().includes('night') || shiftRaw.includes('2')
            ? 'Shift 2 (Night)'
            : 'Shift 1 (Day)';

          const targetUnits = Number(findVal(['target', 'plan', 'goal']) || 1000);
          const actualUnits = Number(findVal(['actual', 'output', 'produced', 'total']) || 950);
          const passedUnits = Number(findVal(['passed', 'good', 'ok', 'pass']) || Math.floor(actualUnits * 0.98));
          const defectUnits = Number(findVal(['defect', 'scrap', 'ng', 'fail', 'reject']) || Math.max(0, actualUnits - passedUnits));

          const downtimeMinutes = Number(findVal(['downtime', 'dt', 'stop', 'idlemin']) || 0);
          const downtimeReason = String(findVal(['reason', 'cause', 'downtimereason', 'stoppage']) || (downtimeMinutes > 0 ? 'Equipment Maintenance' : 'None / Normal')).trim();
          const topDefectCode = String(findVal(['defectcode', 'topdefect', 'failurecode', 'error']) || (defectUnits > 0 ? 'DF-100 General Anomaly' : 'None')).trim();

          const yieldRateRaw = findVal(['yield', 'fpy', 'yieldrate', 'passrate']);
          const yieldRate = yieldRateRaw !== undefined && Number(yieldRateRaw) > 0
            ? Number(yieldRateRaw)
            : actualUnits > 0
            ? Number(((passedUnits / actualUnits) * 100).toFixed(2))
            : 100;

          const oeeRaw = findVal(['oee', 'efficiency', 'effectiveness']);
          const oee = oeeRaw !== undefined && Number(oeeRaw) > 0
            ? Number(oeeRaw)
            : Number((Math.min(98, Math.max(65, (actualUnits / (targetUnits || 1)) * 90))).toFixed(1));

          let status: LineStatus = 'running';
          if (downtimeMinutes >= 45 || yieldRate < 96) {
            status = 'warning';
          }
          if (downtimeMinutes >= 90) {
            status = 'down';
          }

          return {
            id: `PRD-${Date.now()}-${index + 1}`,
            date: String(findVal(['date', 'day', 'timestamp']) || new Date().toISOString().slice(0, 10)),
            lineId,
            lineName: `${lineId} - ${station}`,
            station,
            shift,
            targetUnits,
            actualUnits,
            passedUnits,
            defectUnits,
            yieldRate,
            downtimeMinutes,
            downtimeReason,
            topDefectCode,
            oee,
            status,
          };
        });

        resolve(parsedRecords);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

export const exportRecordsToExcel = (records: ProductionRecord[], filename = 'production_line_export.xlsx') => {
  const exportData = records.map((r) => ({
    Line_ID: r.lineId,
    Station: r.station,
    Shift: r.shift,
    Date: r.date,
    Target_Units: r.targetUnits,
    Actual_Units: r.actualUnits,
    Passed_Units: r.passedUnits,
    Defect_Units: r.defectUnits,
    Yield_Rate_Pct: r.yieldRate,
    Downtime_Minutes: r.downtimeMinutes,
    Downtime_Reason: r.downtimeReason,
    Top_Defect_Code: r.topDefectCode,
    OEE_Pct: r.oee,
    Line_Status: r.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Production_Data');
  XLSX.writeFile(workbook, filename);
};

export const exportRecordsToCsv = (records: ProductionRecord[], filename = 'production_line_export.csv') => {
  const exportData = records.map((r) => ({
    Line_ID: r.lineId,
    Station: r.station,
    Shift: r.shift,
    Date: r.date,
    Target_Units: r.targetUnits,
    Actual_Units: r.actualUnits,
    Passed_Units: r.passedUnits,
    Defect_Units: r.defectUnits,
    Yield_Rate_Pct: r.yieldRate,
    Downtime_Minutes: r.downtimeMinutes,
    Downtime_Reason: r.downtimeReason,
    Top_Defect_Code: r.topDefectCode,
    OEE_Pct: r.oee,
    Line_Status: r.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const csvContent = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
