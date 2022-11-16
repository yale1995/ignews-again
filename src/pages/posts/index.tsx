import styles from "./styles.module.scss";

import { GetStaticProps } from "next";
import { prismic } from "../../services/prismic";
import { RichText } from "prismic-dom";
import Link from "next/link";

interface PostsProps {
  posts: Post[];
}

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updated_at: string;
};

export default function Posts(props: PostsProps) {
  return (
    <>
      <title>Posts | Ignews</title>
      <main className={styles.container}>
        <div className={styles.posts}>
          {props.posts.map((post) => (
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
  const response = await prismic.getByType("publication", {
    pageSize: 100,
  });

  const posts = response.results.map((post) => {
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
