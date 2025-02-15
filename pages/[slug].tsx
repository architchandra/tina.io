import { BlocksPage } from 'components/blocks/BlocksPage'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useTina } from 'tinacms/dist/react'
import { fileToUrl } from 'utils/urls'
import { client } from '../tina/__generated__/client'

const fg = require('fast-glob')

const Page = props => {
  const tinaData = useTina({
    query: props.query,
    data: props.data,
    variables: props.vars,
  })
  const data = tinaData.data.page

  return <BlocksPage data={data} recentPosts={tinaData.data.recentPosts} />
}

export const getStaticProps: GetStaticProps = async function ({
  preview,
  previewData,
  ...ctx
}) {
  const slug = ctx.params?.slug || 'home'
  const vars = { relativePath: slug + '.json' }

  const res = await client.queries.pageWithRecentPosts({ relativePath: slug + '.json' })

  return {
    props: {
      query: res.query,
      data: res.data,
      vars,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async function () {
  const pages = await fg(`./content/blocksPages/*.json`)
  const paths = pages.map(file => {
    const slug = fileToUrl(file, 'blocksPages')
    return { params: { slug } }
  })
  return {
    paths: paths,
    fallback: false,
  }
}

export default Page
