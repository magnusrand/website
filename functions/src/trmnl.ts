import { Octokit } from '@octokit/core'
import { onRequest } from 'firebase-functions/v2/https'

type PullRequestType = {
    title: string
    updated_at: string
    head: string
    base: string
    requested_reviewers: {
        login: string
        id: string
        avatar_url: string
    }[]
    draft: boolean
    user: {
        login: string
        id: string
        avatar_url: string
    }
    last_review_by_me:
        | 'APPROVED'
        | 'CHANGES_REQUESTED'
        | 'COMMENTED'
        | 'DISMISSED'
        | null
}

type GithubPullRequestResponseType = {
    title: string
    updated_at: string
    created_at: string
    head: {
        ref: string
    }
    base: {
        ref: string
    }
    requested_reviewers: {
        login: string
        id: string
        avatar_url: string
    }[]
    draft: boolean
    user: {
        login: string
        id: string
        avatar_url: string
    }
    number: number
}

export const getTrmnlDisplayData = onRequest(
    {
        cors: true,
        region: 'europe-north1',
        secrets: ['TRMNL_TOKEN', 'PROXY_AUTH_TOKEN'],
    },
    async (request, response) => {
        if (!request.headers.authorization) {
            response.status(401).send(JSON.stringify({ error: 'Unauthorized' }))
            return
        }
        if (
            !request.headers.authorization.startsWith('Bearer ') ||
            request.headers.authorization.split(' ')[1] !==
                process.env.PROXY_AUTH_TOKEN
        ) {
            response.status(403).send(JSON.stringify({ error: 'Forbidden' }))
            return
        }

        const octokit = new Octokit({
            auth: process.env.TRMNL_TOKEN,
        })

        const githubResponse = await octokit.request(
            'GET /repos/entur/design-system/pulls',
            {
                owner: 'entur',
                repo: 'design-system',
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            },
        )

        if (githubResponse.status !== 200) {
            response
                .status(500)
                .send(
                    JSON.stringify({ error: 'Failed to fetch pull requests' }),
                )
            return
        }

        const pullRequests: PullRequestType[] = await Promise.all(
            githubResponse?.data?.map(
                async (pr: GithubPullRequestResponseType) => {
                    const reviewsForPRResponse = await octokit.request(
                        'GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews',
                        {
                            owner: 'entur',
                            repo: 'design-system',
                            pull_number: pr.number,
                            headers: { 'X-GitHub-Api-Version': '2022-11-28' },
                        },
                    )

                    const MY_GITHUB_USERNAME = 'magnusrand'
                    const lastReviewByMe = ([...reviewsForPRResponse.data]
                        // we reverse the array to get the latest review first
                        .reverse()
                        .find((r) => r.user?.login === MY_GITHUB_USERNAME)
                        ?.state ?? null) as PullRequestType['last_review_by_me']

                    // 3) your existing mapping + our two new fields
                    const daysSinceUpdate = Math.floor(
                        (Date.now() - new Date(pr.updated_at).getTime()) /
                            (1000 * 60 * 60 * 24),
                    )

                    return {
                        title: pr.title,
                        created_at: pr.created_at,
                        updated_at: pr.updated_at,
                        head: pr.head.ref,
                        base: pr.base.ref,
                        requested_reviewers: pr.requested_reviewers.map(
                            (reviewer) => ({
                                login: reviewer.login,
                                id: reviewer.id,
                                avatar_url: reviewer.avatar_url,
                            }),
                        ),
                        draft: pr.draft,
                        user: {
                            login: pr.user.login,
                            id: pr.user.id,
                            avatar_url: pr.user.avatar_url,
                        },
                        days_since_update: daysSinceUpdate,
                        days_since_update_text:
                            daysSinceUpdate === 0
                                ? 'i dag'
                                : `${daysSinceUpdate} dager siden`,
                        last_review_by_me: lastReviewByMe,
                    }
                },
            ),
        )

        response.status(200).send(JSON.stringify({ pullRequests }))
    },
)
