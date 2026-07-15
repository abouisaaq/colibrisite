export type ArticleImageItem = {
  src: string;
  alt?: string;
};

export type ImageAlign = "left" | "center" | "right";

export type MediaObjectFit = "contain" | "cover";

export type MediaItemAspect = "auto" | "4/3" | "16/10" | "1/1" | "16/9";

export type ArticleMediaBlockAttrs = {
  width: string;
  align: ImageAlign;
  itemAspect: MediaItemAspect;
  objectFit: MediaObjectFit;
};
