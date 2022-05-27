import { NextPage, InferGetStaticPropsType } from "next";
import { getAllPosts } from "../lib/api";
import Link from "next/link";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  const posts = getAllPosts(["slug", "title", "date", "tags"]);

  return {
    props: { posts },
  };
};

const Home: NextPage<Props> = ({ posts }) => (
  <ul>
    {posts?.map((post) => (
      <div key={post.slug}>
        <li>
          <Link href={`/posts/${post.slug}`}>
            <a>
              <h2>{post.title}</h2>
            </a>
          </Link>
          <p>{post.date}</p>
          <ul>
            {post.tags?.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </li>
      </div>
    ))}
  </ul>
);

export default Home;
