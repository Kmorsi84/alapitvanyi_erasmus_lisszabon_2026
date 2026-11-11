import { CoordinatorDashboard } from './CoordinatorDashboard';

interface TeacherDashboardProps {
  onLogout: () => void;
  onReturnToGame: () => void;
}

/**
 * Teacher / Coordinator Dashboard wrapper
 */
export function TeacherDashboard(props: TeacherDashboardProps) {
  return <CoordinatorDashboard {...props} />;
}
