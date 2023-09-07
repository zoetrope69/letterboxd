import z from "zod";
declare const ratingSchema: z.ZodObject<
  {
    text: z.ZodString;
    score: z.ZodNumber;
  },
  "strip",
  z.ZodTypeAny,
  {
    text?: string;
    score?: number;
  },
  {
    text?: string;
    score?: number;
  }
>;
export type Rating = z.infer<typeof ratingSchema>;
declare const getImageSchema: z.ZodObject<
  {
    tiny: z.ZodString;
    small: z.ZodString;
    medium: z.ZodString;
    large: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    tiny?: string;
    small?: string;
    medium?: string;
    large?: string;
  },
  {
    tiny?: string;
    small?: string;
    medium?: string;
    large?: string;
  }
>;
export type Image = z.infer<typeof getImageSchema>;
declare const listFilms: z.ZodObject<
  {
    title: z.ZodString;
    uri: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    title?: string;
    uri?: string;
  },
  {
    title?: string;
    uri?: string;
  }
>;
export type ListFilms = z.infer<typeof listFilms>;
declare const Diary: z.ZodObject<
  {
    type: z.ZodLiteral<"diary">;
    date: z.ZodObject<
      {
        published: z.ZodNumber;
        watched: z.ZodOptional<z.ZodNumber>;
      },
      "strip",
      z.ZodTypeAny,
      {
        published?: number;
        watched?: number;
      },
      {
        published?: number;
        watched?: number;
      }
    >;
    film: z.ZodObject<
      {
        title: z.ZodString;
        year: z.ZodString;
        image: z.ZodObject<
          {
            tiny: z.ZodString;
            small: z.ZodString;
            medium: z.ZodString;
            large: z.ZodString;
          },
          "strip",
          z.ZodTypeAny,
          {
            tiny?: string;
            small?: string;
            medium?: string;
            large?: string;
          },
          {
            tiny?: string;
            small?: string;
            medium?: string;
            large?: string;
          }
        >;
      },
      "strip",
      z.ZodTypeAny,
      {
        title?: string;
        year?: string;
        image?: {
          tiny?: string;
          small?: string;
          medium?: string;
          large?: string;
        };
      },
      {
        title?: string;
        year?: string;
        image?: {
          tiny?: string;
          small?: string;
          medium?: string;
          large?: string;
        };
      }
    >;
    rating: z.ZodObject<
      {
        text: z.ZodString;
        score: z.ZodNumber;
      },
      "strip",
      z.ZodTypeAny,
      {
        text?: string;
        score?: number;
      },
      {
        text?: string;
        score?: number;
      }
    >;
    review: z.ZodString;
    spoilers: z.ZodBoolean;
    isRewatch: z.ZodBoolean;
    uri: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    type?: "diary";
    date?: {
      published?: number;
      watched?: number;
    };
    film?: {
      title?: string;
      year?: string;
      image?: {
        tiny?: string;
        small?: string;
        medium?: string;
        large?: string;
      };
    };
    rating?: {
      text?: string;
      score?: number;
    };
    review?: string;
    spoilers?: boolean;
    isRewatch?: boolean;
    uri?: string;
  },
  {
    type?: "diary";
    date?: {
      published?: number;
      watched?: number;
    };
    film?: {
      title?: string;
      year?: string;
      image?: {
        tiny?: string;
        small?: string;
        medium?: string;
        large?: string;
      };
    };
    rating?: {
      text?: string;
      score?: number;
    };
    review?: string;
    spoilers?: boolean;
    isRewatch?: boolean;
    uri?: string;
  }
>;
export type Diary = z.infer<typeof Diary>;
declare const List: z.ZodObject<
  {
    type: z.ZodLiteral<"list">;
    date: z.ZodObject<
      {
        published: z.ZodNumber;
      },
      "strip",
      z.ZodTypeAny,
      {
        published?: number;
      },
      {
        published?: number;
      }
    >;
    title: z.ZodString;
    description: z.ZodString;
    ranked: z.ZodBoolean;
    films: z.ZodArray<
      z.ZodObject<
        {
          title: z.ZodString;
          uri: z.ZodString;
        },
        "strip",
        z.ZodTypeAny,
        {
          title?: string;
          uri?: string;
        },
        {
          title?: string;
          uri?: string;
        }
      >,
      "many"
    >;
    totalFilms: z.ZodNumber;
    uri: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    type?: "list";
    date?: {
      published?: number;
    };
    title?: string;
    description?: string;
    ranked?: boolean;
    films?: {
      title?: string;
      uri?: string;
    }[];
    totalFilms?: number;
    uri?: string;
  },
  {
    type?: "list";
    date?: {
      published?: number;
    };
    title?: string;
    description?: string;
    ranked?: boolean;
    films?: {
      title?: string;
      uri?: string;
    }[];
    totalFilms?: number;
    uri?: string;
  }
>;
export type List = z.infer<typeof List>;
type ResponseSchema = Diary & List & string;
declare function letterboxd(username: string): Promise<ResponseSchema[]>;
export default letterboxd;
