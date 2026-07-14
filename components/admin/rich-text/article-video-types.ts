export type ArticleVideoAspect = "16/9" | "4/3" | "1/1" | "9/16";

export type ArticleVideoAttrs = {
  src: string;
  youtubeId: string;
  poster: string;
  width: string;
  align: "left" | "center" | "right";
  aspect: ArticleVideoAspect;
};
