import { GetStaticProps } from "next";
import { prismic } from "../../services/prismic";
import { RichText } from "prismic-dom";
import Link from "next/link";
import styles from "./styles.module.scss";

interface PostsProps {
  posts: Post[];
}

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updated_at: string;
};

export default function Posts({posts}: PostsProps) {
  return (
    <>
      <title>Posts | Ignews</title>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updated_at}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await prismic.getAllByType("publication", {
    pageSize: 100,
  });

  const posts = await response?.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find((content) => content.type === "paragraph")
          ?.text ?? "",
      updated_at: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  return {
    props: {
      posts,
    },
  };
};
