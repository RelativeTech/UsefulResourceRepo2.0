---
title: Home
sections:
    - section_id: hero
      type: section_hero
      title: Hero Section
      image: images/5.jpg
      content: >-
          This section can contain a subtitle or tagline. The recommended length is
          one to three sentences, but can be changed as you prefer.
      actions:
          - label: Get Started
            url: /docs
            style: primary
    - section_id: features
      type: section_grid
      col_number: three
      grid_items:
          - title: Documentation
            content: >-
                Donec lobortis velit sed suscipit lobortis. Ut non quam metus. Nullam
                a maximus mi. Quisque justo nunc, sollicitudin euismod euismod at,
                tincidunt ut tellus. Vivamus rhoncus mattis varius.
            actions:
                - label: Get Started
                  url: /docs
                  style: link
          - title: Blog
            content: >-
                Vestibulum a nunc ut eros condimentum posuere. Nullam dapibus quis
                nunc non interdum. Pellentesque tortor ligula, gravida ac commodo eu.
            actions:
                - label: View Posts
                  url: /blog
                  style: link
          - title: Style Guide
            content: >-
                Donec lobortis velit sed suscipit lobortis. Ut non quam metus. Nullam
                a maximus mi. Quisque justo nunc, sollicitudin euismod euismod at,
                tincidunt ut tellus. Vivamus rhoncus mattis varius.
            actions:
                - label: Learn More
                  url: /style-guide
                  style: link
    - section_id: text-img
      type: section_content
      image: images/jamstack.svg
      image_position: left
      title: A Section With An Image
      content: >-
          Nam pulvinar ante eu ultricies volutpat. Sed nulla nibh, dapibus sit amet
          cursus quis, fringilla nec sapien. Vestibulum imperdiet nunc bibendum
          consectetur lobortis.
      actions:
          - label: View Demo
            url: /docs/getting-started
            style: primary
          - label: Get Started
            url: /docs/getting-started
            style: secondary
    - section_id: text-no-img
      type: section_content
      title: A Section Without Image
      content: >-
          Nam pulvinar ante eu ultricies volutpat. Sed nulla nibh, dapibus sit amet
          cursus quis, fringilla nec sapien. Vestibulum imperdiet nunc bibendum
          consectetur lobortis.
      actions:
          - label: Get Started
            url: /docs/getting-started/installation
            style: primary
    - section_id: features-two-col
      type: section_grid
      title: Sample Layouts
      subtitle: An optional subtitle of the section
      col_number: two
      grid_items:
          - title: Overview
            content: >-
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl
                ligula, cursus id molestie vel, maximus aliquet risus. Vivamus in nibh
                fringilla, fringilla tortor at, pulvinar orci.
            actions:
                - label: Learn More
                  url: /overview
                  style: link
          - title: Showcase
            content: >-
                Donec lobortis velit sed suscipit lobortis. Ut non quam metus. Nullam
                a maximus mi. Quisque justo nunc, sollicitudin euismod euismod at,
                tincidunt ut tellus. Vivamus rhoncus mattis varius.
            actions:
                - label: Learn More
                  url: /showcase
                  style: link
    - section_id: cta
      type: section_cta
      title: The Title of The Call to Action Block
      subtitle: This is an optional description for the call to action block.
      actions:
          - label: Get Started
            url: /docs/getting-started/installation
            style: primary
seo:
    title: Bryan Guner Blog
    description: The preview of the Libris theme
    extra:
        - name: 'og:type'
          value: website
          keyName: property
        - name: 'og:title'
          value: Bryan Guner Blog
          keyName: property
        - name: 'og:description'
          value: The preview of the Libris theme
          keyName: property
        - name: 'og:image'
          value: images/4.jpg
          keyName: property
          relativeUrl: true
        - name: 'twitter:card'
          value: summary_large_image
        - name: 'twitter:title'
          value: Bryan Guner Blog
        - name: 'twitter:description'
          value: The preview of the Libris theme
        - name: 'twitter:image'
          value: images/4.jpg
          relativeUrl: true
layout: advanced
---
