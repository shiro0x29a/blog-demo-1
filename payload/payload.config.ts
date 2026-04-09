import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Users } from './src/collections/Users'
import { Posts } from './src/collections/Posts'
import { Categories } from './src/collections/Categories'
import { Media } from './src/collections/Media'
import { Authors } from './src/collections/Authors'
import { Header } from './src/globals/Header'
import { Footer } from './src/globals/Footer'
import path from 'path'

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [Users, Posts, Categories, Media, Authors],
  globals: [Header, Footer],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(__dirname, '../payload-types.ts'),
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
