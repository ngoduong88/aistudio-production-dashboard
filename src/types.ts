export type ShiftType = 'Shift 1 (Day)' | 'Shift 2 (Night)';
export type LineStatus = 'running' | 'warning' | 'down' | 'maintenance';
export type DashboardTemplate = 'celestial_dark' | 'simple_charts' | 'shop_floor' | 'full_table';

export interface ProductionRecord {
  id: string;
  date: string;
  lineId: string;
  lineName: string;
  station: string;
  shift: ShiftType;
  targetUnits: number;
  actualUnits: number;
  passedUnits: number;
  defectUnits: number;
  yieldRate: number; // percentage, e.g. 98.4
  downtimeMinutes: number;
  downtimeReason: string;
  topDefectCode: string;
  oee: number; // percentage, e.g. 88.5
  status: LineStatus;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  latencyMs?: number;
}

export interface ProductionKPIs {
  totalTarget: number;
  totalActual: number;
  totalPassed: number;
  totalDefects: number;
  fleetYieldRate: number;
  averageOEE: number;
  totalDowntimeMinutes: number;
  activeLinesCount: number;
}

// Additional modular showcase types
export type DemoTab = 'analytics' | 'kanban' | 'synth' | 'simulation';
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimateHours: number;
}

export interface MetricPoint {
  date: string;
  revenue: number;
  orders: number;
  latencyMs: number;
}

export interface CapabilityItem {
  id: string;
  category: string;
  title: string;
  tagline: string;
  description: string;
  architecture: string[];
  samplePrompt: string;
}

export interface ProjectScopeConfig {
  appType: string;
  domain: string;
  backendNeeded: boolean;
  database: 'none' | 'firestore' | 'cloudsql' | 'local';
  authNeeded: boolean;
  features: string[];
  customGoal: string;
}
