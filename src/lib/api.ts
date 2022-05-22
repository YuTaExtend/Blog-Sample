import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

// Markdownファイルが格納されているディレクトリを取得する
// ※process.cwd() はカレントディレクトリ
const postsDirectory = join(process.cwd(), "public/contents");

// contents配下にあるフォルダ名(slug)をすべて取得する
export const getPostSlugs = () => {
  const allDirents = fs.readdirSync(postsDirectory, { withFileTypes: true });
  return allDirents
    .filter((dirent) => dirent.isDirectory())
    .map(({ name }) => name);
};

export type Post = {
  slug: string;
  content: string;
  title: string;
  date: string;
  tags: string[];
};

/**
 * 与えられたslugから記事の内容を取得して返す
 * @param slug
 * @param fields 取得したい項目
 */
export const getPostBySlug = (slug: string, fields: string[] = []) => {
  // ファイルを読み込む
  const fullPath = join(postsDirectory, slug, "index.md");
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const post: Post = {
    slug: "",
    content: "",
    title: "",
    date: "",
    tags: [],
  };

  // 指定された値を取得する
  fields.forEach((field) => {
    if (field === "slug") {
      post[field] = slug;
    }
    if (field === "content") {
      post[field] = content;
    }
    if (field === "title" || field === "date" || field === "tags") {
      post[field] = data[field];
    }
  });

  return post;
};

/**
 * すべての記事から指定したfieldsの値を取得する
 * @param fields 取得したい項目
 */
export const getAllPosts = (fields: string[] = []) => {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .sort((a, b) => {
      // 日付の降順でソート
      const slugA = a.date;
      const slugB = b.date;
      if (slugA < slugB) {
        return 1;
      } else {
        slugB < slugA;
      }
      return slugA <= slugB ? 1 : -1;
    });

  return posts;
};
