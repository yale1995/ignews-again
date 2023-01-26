import { render, screen } from '@testing-library/react'
import Posts, { Post } from '../../pages/posts/index'

jest.mock("../../services/prismic", () => {
    return {
      client: {
        getAllByType: jest.fn(),
      },
    };
  });

const posts = [
    {
        slug: 'fake-slug',
        title: 'Fake title 1',
        excerpt: 'Fake excerpt 1',
        updated_at: '2020-01-01',
    }
] as Post[];

describe('Posts page', () => {
    it('should renders correctly', () => {
        render(<Posts posts={posts} />)

        expect(screen.getByText('Fake title 1')).toBeInTheDocument()
    })
})