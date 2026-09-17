import { config } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    posts: {
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: 'frontmatter',
      schema: {
        title: fields.slug({
          label: 'Title',
          name: { label: 'Slug' },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        date: fields.date({
          label: 'Date',
        }),
        section: fields.select({
          label: 'Section',
          options: [
            { label: 'Philosophy', value: 'Philosophy' },
            { label: 'Plans', value: 'Plans' },
            { label: 'Ideas', value: 'Ideas' },
            { label: 'Log', value: 'Log' },
          ],
          defaultValue: 'Philosophy',
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Final', value: 'final' },
            { label: 'Final(ish)', value: 'final(ish)' },
          ],
          defaultValue: 'final',
        }),
        amended: fields.date({
          label: 'Amended',
        }),
        tags: fields.array({
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        body: fields.markdoc({
          label: 'Body',
        }),
      },
    },
  },
});
