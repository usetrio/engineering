# Trio Engineering Blog
This is the source code of [Trio Engineering Blog - engineering.trio.dev](https://engineering.trio.dev). It's a static website built with [Jekyll](http://jekyllrb.com/).

## Cloning
This repository does use git submodules, so make sure to clone recursively: `git clone --recursive git@github.com:usetrio/trio-engineering-blog.git`.

## Writing Posts
If you're looking for creating new posts, you should [take a look here](https://github.com/usetrio/trio-engineering-blog-posts).

## Contributing
1. Fork the `master` branch
2. Do your changes
3. Create a Pull Request
4. Wait for your PR be reviewed
5. When you PR get merged, it'll automatically trigger the [deploy workflow](https://github.com/usetrio/trio-engineering-blog/blob/master/.circleci/config.yml#L3-L17)

## Running
1. You must have installed `ruby 2.5+`
2. Install `bundler` with `gem install bundler`
3. Install project dependencies with `bundle install`

Now you can [`jekyll` commands](https://jekyllrb.com/docs/usage/):

| Command        | Description                                               |
| -------------- | --------------------------------------------------------- |
| `jekyll serve` | Build and serve locally the project                       |
| `jekyll build` | Build the project and put the files under `build/` folder |

## License
The following directories and their contents are Copyright Trio's. You may not reuse anything therein without Trio's permission:

* _data/
* _posts/
* _uploads/

All other directories and files are MIT Licensed.