
export type DayOfWeek = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';

export interface PostContent {
  day: DayOfWeek;
  text: string;
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}

export interface AppState {
  posts: Record<DayOfWeek, PostContent>;
  selectedDay: DayOfWeek;
}
