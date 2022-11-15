import styles from "./styles.module.scss";

import { GetStaticProps } from "next";
import { prismic } from "../../services/prismic";

export default function Posts(props) {
  console.log(props.data);

  return (
    <>
      <title>Posts | Ignews</title>
      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>13 de Novembro de 2022</time>
            <strong>Aqui ficará o título do post</strong>
            <p>
              Este espaço é reservado para discorrer a cerca do assunto. Deve
              conter em torno de um parágrafo.
            </p>
          </a>
          <a href="#">
            <time>13 de Novembro de 2022</time>
            <strong>Aqui ficará o título do post</strong>
            <p>
              Este espaço é reservado para discorrer a cerca do assunto. Deve
              conter em torno de um parágrafo.
            </p>
          </a>
          <a href="#">
            <time>13 de Novembro de 2022</time>
            <strong>Aqui ficará o título do post</strong>
            <p>
              Este espaço é reservado para discorrer a cerca do assunto. Deve
              conter em torno de um parágrafo.
            </p>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await prismic.getByType("publication", {
    pageSize: 100,
  });

  return {
    props: {
      data: response,
    },
  };
};
