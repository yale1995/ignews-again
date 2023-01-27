import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock';
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getSession } from 'next-auth/react';
import { prismic } from '../../services/prismic'

jest.mock("../../services/prismic", () => {
    return {
        prismic: {
            getByUID: jest.fn(),
        },
    };
});

jest.mock('next-auth/react');

const post = {
    slug: 'fake-slug',
    title: 'Fake title 1',
    content: '<p>Fake excerpt</p>',
    updated_at: '2020-01-01',
}

describe('Post page', () => {
    it('should renders correctly', () => {
        render(<Post post={post} />)

        expect(screen.getByText('Fake title 1')).toBeInTheDocument()
        expect(screen.getByText('Fake excerpt')).toBeInTheDocument()
    })

    it('should redirects user to home if no subscription is found', async () => {
        const getSessionMocked = mocked(getSession)
        getSessionMocked.mockReturnValueOnce({
            activeSubscription: null,
        } as any)

        const response = await getServerSideProps({
            params: {
                slug: 'fake-slug'
            }
        } as any)

        expect(response).toEqual(expect.objectContaining({
            redirect: {
                destination: '/',
                permanent: false
            }
        }))

    })

    it('should redirects user to slug-route if subscription is found', async () => {
        const getSessionMocked = mocked(getSession)
        getSessionMocked.mockReturnValueOnce({
            activeSubscription: 'active',
        } as any)

        const PrismicClientMocked = mocked(prismic);
        PrismicClientMocked.getByUID.mockResolvedValueOnce({
            data: {
                title: [{ text: 'fake-title' }],
                content: [
                    {
                        type: 'paragraph',
                        text: 'fake-content'
                    }
                ],
            },
            last_publication_date: '2020-01-01',
        } as any)

        const response = await getServerSideProps({
            params: {
                slug: 'fake-slug',
            }
        } as any)

        expect(response).toEqual(expect.objectContaining({
            props: {
                post: {
                    slug: 'fake-slug',
                    title: 'fake-title',
                    content: '<p>fake-content</p>',
                    updated_at: '31 de dezembro de 2019'
                }
            }
        } as any))
    })
})