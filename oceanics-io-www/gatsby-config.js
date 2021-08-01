module.exports = {
    siteMetadata: {
        title: `Oceanics.io`,
        author: `Nicholas Keeney`,
        description: `Situational awareness for a changing ocean`,
        siteUrl: `https://www.oceanics.io`
    },
    plugins: [
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/blog`,
                name: `blog`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/assets`,
                name: `assets`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/src/data`,
                name: `data`,
                ignore: [`**/\.*`]
            },
        },
        {
            resolve: `gatsby-plugin-mdx`,
            options: {
                extensions: [".mdx", ".md"],
                gatsbyRemarkPlugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 590,
                        },
                    },
                    {
                        resolve: `gatsby-remark-katex`,
                        options: {
                            // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
                            strict: `ignore`
                        }
                    },
                    {
                        resolve: `gatsby-remark-responsive-iframe`,
                        options: {
                            wrapperStyle: `margin-bottom: 1.0725rem`,
                        },
                    },
                    `gatsby-remark-copy-linked-files`,
                    `gatsby-remark-smartypants`,
                    {
                        resolve: `gatsby-remark-prismjs`,
                        options: {
                        
                            classPrefix: "language-",
                            inlineCodeMarker: null,
                            aliases: {},
                            showLineNumbers: false,
                            noInlineHighlight: false,
                            languageExtensions: [],
                            escapeEntities: {},
                        },
                    },
                ],
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        'gatsby-plugin-styled-components',
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `Oceanicsdotio`,
                short_name: `GatsbyJS`,
                start_url: `/`,
                background_color: `#000000`,
                theme_color: `#EF5FA1`,
                display: `minimal-ui`,
                icon: `src/images/favicon.png`,
            },
        },
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-plugin-create-client-paths`,
            options: { prefixes: [`/catalog/*`] },
        },
        `gatsby-plugin-offline`,  // service worker implementation
        `gatsby-transformer-yaml-full`,
        `gatsby-plugin-workerize-loader`
    ],
}