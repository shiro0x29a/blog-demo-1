import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Users } from './src/collections/Users'
import { Posts } from './src/collections/Posts'
import { Categories } from './src/collections/Categories'
import { Tags } from './src/collections/Tags'
import { Media } from './src/collections/Media'
import { Authors } from './src/collections/Authors'
import { Header } from './src/globals/Header'
import { Footer } from './src/globals/Footer'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Blog Admin',
    },
  },
  collections: [Users, Posts, Categories, Tags, Media, Authors],
  globals: [Header, Footer],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  plugins: [],
  cors: [process.env.PAYLOAD_PUBLIC_URL || ''].filter(Boolean),
  csrf: [process.env.PAYLOAD_PUBLIC_URL || ''].filter(Boolean),
})
