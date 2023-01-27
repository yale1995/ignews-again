import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock';
import { getStaticProps } from '../../pages/posts/index';
import Posts, { Post } from '../../pages/posts/index'
import { prismic } from '../../services/prismic';

jest.mock("../../services/prismic", () => {
  return {
    prismic: {
      getAllByType: jest.fn(),
    },
  };
});

const posts = [
  {
    slug: 'fake-slug',
    title: 'Fake title 1',
    excerpt: 'Fake excerpt',
    updated_at: '2020-01-01',
  }
] as Post[];

describe('Posts page', () => {
  it('should renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('Fake title 1')).toBeInTheDocument()
  })

  it('should loads initial data', async () => {
    const PrismicClientMocked = mocked(prismic);
    PrismicClientMocked.getAllByType.mockResolvedValueOnce([
      {
        uid: 'fake-slug',
        data: {
          title: [
            {text:'Fake title 1'}
          ], 
          content: [
            {
              type: 'paragraph',
              text: 'Fake excerpt 1',
            },
          ],
        },
        last_publication_date: '2020-01-01',
      }
    ] as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'fake-slug',
              title: 'Fake title 1',
              excerpt: 'Fake excerpt 1',
              updated_at: '31 de dezembro de 2019',
            }
          ]
        }
      })
    )
  })
})