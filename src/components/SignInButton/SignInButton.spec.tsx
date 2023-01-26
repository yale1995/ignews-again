import { render, screen } from '@testing-library/react'
import { SignInButton } from './SignInButton'
import { mocked } from 'jest-mock'
import { useSession } from 'next-auth/react'
import React from 'react'

jest.mock("next-auth/react");

describe('SignInButton component', () => {

    it('renders correctly when user is not authenticated', () => {
        const useSessionMocked = mocked(useSession)
        useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' });

        render(<SignInButton />)
        expect(screen.getByText('Sign in with Github')).toBeInTheDocument()
    })

    it('renders correctly when user is not authenticated', () => {
        const useSessionMocked = mocked(useSession)
        useSessionMocked.mockReturnValueOnce({
            data: {
                user: { name: "John Doe", email: "john.doe@example.com" },
                expires: "fake-expires",
            },
        } as any);


        render(<SignInButton />)
        expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
})