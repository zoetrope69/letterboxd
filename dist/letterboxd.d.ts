export declare type Rating = {
  text: string;
  score: number;
};
export declare type Image =
  | {
      tiny: string;
      small: string;
      medium: string;
      large: string;
    }
  | {};
export declare type ListFilms = {
  title: string;
  uri: string;
};
export declare type Diary = {
  type: "diary";
  date: {
    published: number;
    watched?: number;
  };
  film: {
    title: string;
    year: string;
    image: Image;
  };
  rating: Rating;
  review: string;
  spoilers: boolean;
  isRewatch: boolean;
  uri: string;
};
export declare type List = {
  type: "list";
  date: {
    published: number;
  };
  title: string;
  description: string;
  ranked: boolean;
  films: ListFilms[];
  totalFilms: number;
  uri: string;
};
declare function letterboxd(username: string): Promise<Diary[] | List[]>;
export default letterboxd;
