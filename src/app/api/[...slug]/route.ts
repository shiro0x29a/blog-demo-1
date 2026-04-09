import {
  REST_DELETE,
  REST_GET,
  REST_PATCH,
  REST_POST,
  PUT_HANDLER,
} from '@payloadcms/next/routes'
import configPromise from '@payload-config'

export const GET = REST_GET(configPromise)
export const POST = REST_POST(configPromise)
export const PATCH = REST_PATCH(configPromise)
export const PUT = PUT_HANDLER(configPromise)
export const DELETE = REST_DELETE(configPromise)
