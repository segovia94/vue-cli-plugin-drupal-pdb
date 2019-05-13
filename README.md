# Vue CLI 3 plugin for Drupal Progressively Decoupled Blocks

You can now easily generate [PDB Vue](https://www.drupal.org/project/pdb_vue)
blocks for Drupal via the [Vue CLI](https://cli.vuejs.org/). This means that you
can do your Vue development like you would on most any project with [Single File
Components](https://vuejs.org/v2/guide/single-file-components.html).

## Getting Started

1. Make sure that Vue CLI 3 is installed. https://cli.vuejs.org/guide/installation.html
and create a new project in your module or theme with `vue create pdb_vue`

2. Add this plugin

```bash
vue add vue-cli-plugin-drupal-pdb
```

3. Follow the prompts and choose `Initial framework and first block` to
generate scaffolding and an initial block.

4. Answer the remaining prompts.

## Creating a new Block

(Assuming the initial framework has been generated) to create a new block you
can invoke the plugin again and then choose `New Block` from the prompt.

```bash
vue invoke vue-cli-plugin-drupal-pdb
```

## Choose the Framework Mode type of PDB blocks to create

### Mode: Per-block Vue instances

Each block will be its own Vue instance. This is the safest for working with
Drupal when there will be other javascript working on the site in addition to
Vue. Each instance can still have whatever child components it likes.

Each block will live within its own named directory inside a parent `blocks`
directory.

> One thing to note is that this file structure is different than the
one initially created by Vue CLI. This means that adding other plugins via the
CLI like Vuex or Router may still need to be manually wired up after
installation since the CLI will not understand this new structure when it tries
to modify files.

### Mode: "SPA" single page app

Each block will be a globally registered Vue Component. This means that blocks
can interact with libraries like [Vuex](https://vuex.vuejs.org/) for state
management between blocks. The danger of this mode is that it could cause
problems with other normal Drupal blocks using Javascript.

Each block will be register in a `*.info.yml` file in the `blocks` directory.
This directory will only contain info files since all the javascript will be in
the main `src` directory.

## Library files
By default, a `*.libraries.yml` file will be created. This file should be moved
into the root directory of the module or theme that your PDB Vue blocks are
being created in. However, if this file already exists, simply copy the contents
and paste them into the existing file. The file generated for you can then be
deleted. In other words, you should only have one of these files in your theme
or module.

### Update the scripts and css path
The generated `*.libraries.yml` file also assumes that the directory of all your PDB Vue blocks is called
`pdb_vue`. So the path in this file should be updated to whatever the real path
of those scripts is.
