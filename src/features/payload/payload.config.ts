import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { BlocksFeature } from '@payloadcms/richtext-lexical'
import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Media } from './collections/Media'
import { Authors } from './collections/Authors'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
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
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [
          {
            slug: 'code',
            fields: [
              {
                name: 'language',
                type: 'select',
                defaultValue: 'javascript',
                options: [
                  { label: 'JavaScript', value: 'javascript' },
                  { label: 'TypeScript', value: 'typescript' },
                  { label: 'Python', value: 'python' },
                  { label: 'HTML', value: 'html' },
                  { label: 'CSS', value: 'css' },
                  { label: 'JSON', value: 'json' },
                  { label: 'Bash', value: 'bash' },
                  { label: 'Text', value: 'text' },
                ],
              },
              {
                name: 'filename',
                type: 'text',
                required: false,
                admin: {
                  description: 'Optional filename to display (e.g., main.py, index.js)',
                },
              },
              {
                name: 'code',
                type: 'textarea',
                required: true,
              },
            ],
          },
        ],
      }),
    ],
  }),
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
