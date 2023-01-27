import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mocked } from 'jest-mock';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Post from '../../pages/posts/preview/[slug]'
import Home from '../../pages';

jest.mock("../../services/prismic", () => {
    return {
        prismic: {
            getByUID: jest.fn(),
        },
    };
});

jest.mock('next-auth/react');

jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
    }),
}))


jest.mock('../../services/stripe')

const post = {
    slug: 'fake-slug',
    title: 'Fake title 1',
    content: '<p>Fake excerpt</p>',
    updated_at: '2020-01-01',
}

describe('Post page', () => {
    it('should renders correctly', () => {
        const useSessionMocked = mocked(useSession)
        useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' } as any);
        render(<Post post={post} />)
        expect(screen.getByText('Fake title 1')).toBeInTheDocument()
        expect(screen.getByText('Fake excerpt')).toBeInTheDocument()
    })

    it('should redirects user to slug-route if subscription is found', async () => {
        const useRouterMocked = mocked(useRouter)
        const useSessionMocked = mocked(useSession)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce({
            data: {
                user: { name: "John Doe", email: "john.doe@example.com" },
                activeSubscription: 'fake-active-subscription',
                expires: "fake-expires",
            },
        } as any);

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<Post post={post} />)
        expect(pushMock).toHaveBeenCalledWith(`/posts/${post.slug}`)

    })

    it('should redirects user to home if the button "subscribe now" to be clicked', async () => {
        const useRouterMocked = mocked(useRouter)
        const useSessionMocked = mocked(useSession)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce({
            data: {
                user: { name: "John Doe", email: "john.doe@example.com" },
                activeSubscription: 'fake-active-subscription',
                expires: "fake-expires",
            },
        } as any);


        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<Post post={post} />)
        const subscribeLink = screen.getByText(/Subscribe/)
        expect(subscribeLink).toHaveAttribute('href')
        waitFor(() => {
            return expect(screen.getByText(/Subscribe/)).not.toBeInTheDocument()
        })
        waitFor(() => {
            return expect(screen.getByText(/\$10,00/)).toBeInTheDocument()
        })
    })

})        