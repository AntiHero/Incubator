import { h02} from "./@types"

export default {
  blogs: [
    {
      id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      name: 'About everything',
      youtubeUrl: 'https://www.youtube.com/watch?v=vxM3F7qw050',
    },
  ] as h02.db.BlogViewModel[],
  posts: [
    {
      id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6e',
      title: 'What is next?',
      shortDescription: 'fake description',
      content: 'bla-bla-bla',
      blogId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      blogName: 'About everything',
    },
  ] as h02.db.PostViewModel[],
};
