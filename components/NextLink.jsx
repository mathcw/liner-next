import NextLink, { LinkProps } from 'next/link'
import { format } from 'url'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const Link = ({ children, ...props }) => (
  <NextLink
    {...props}
    as={`${format(props.as?props.as:props.href)}`}
  >
    {children}
  </NextLink>
)

export default Link