/**
 * React and friends.
 */
import React from "react";

/**
 * For building and linking data
 */
import { graphql, navigate } from "gatsby";

/**
 * Campaign component
 */
import Campaign, {PageData} from "oceanics-io-ui/build/components/Campaign/Campaign";
import Index from "oceanics-io-ui/build/components/References/Index";

/**
 * Base component for web landing page.
 * 
 * Optionally use query parameters and hash anchor to filter content. 
 */
const IndexPage = ({
    location: {
        search
    },
    ...props
}) => {
    /**
     * Search string query parameters
     */
    // const { query } = useQueryString({
    //     search,
    //     defaults: {
    //         items: itemIncrement,
    //         tag: null,
    //         reference: null
    //     }
    // })
    const query = {
        items: 3,
        tag: "",
        reference: 0,
        inc: 3
    }
    // console.log({Campaign});
    
    return (
        <>
            <Campaign 
                navigate={navigate} 
                title={PageData.title} 
                campaign={PageData.campaigns[0]}
            />
            <Index query={query} onClickTag={()=>()=>{}} {...props}/>
        </>
    )
};

export default IndexPage;

/**
 * GraphQL query for static data to build the content feed and interface.
 */
export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            tags
            title
            description
            citations {
                authors, year, title, journal, volume, pageRange
            }
          }
      }
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`