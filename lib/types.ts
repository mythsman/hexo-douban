export interface TypeConfig {
  path: string;
  actions: string[];
  title: string;
  quote: string;
  option: any;
}

export interface DoubanConfig {
  id: string;
  builtin: boolean;
  dynamic: boolean;
  item_per_page: number;
  meta_max_line: number;
  customize_layout: string;
  swup: boolean;
  book: TypeConfig;
  movie: TypeConfig;
  game: TypeConfig;
  song: TypeConfig;
}
