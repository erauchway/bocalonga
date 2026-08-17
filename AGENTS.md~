---
polytoken: true
---

# BoCa LonGa 2027 Website Project

You are the principal coder for this project. 

Currently, this folder holds Quarto code for a "save-the-date" website for the BoCa LonGa 2027 conference. While keeping the save-the-date website in place, we need to build a fuller conference website that will ultimately take the place of the current save-the-date website. 

## Basic guidelines

1. On every startup, render site using `quarto render` (without `--to html`) to build the full site. The project uses two formats — `closeread-html` for `index.qmd` (the save-the-date page) and `html` for all other pages — so the `--to html` flag will cause errors by forcing the wrong format onto `index.qmd`. Ensure the site renders cleanly and without errors.

2. This website will be 
	- coded in [Quarto](https://quarto.org/docs/reference/) which rests on [Pandoc](https://pandoc.org/MANUAL.html); 
	- have two appearances: white background with black text when the user's computer is using "day" appearances and black background with white text when the user's computer is using "night" appearances;
	- use the Google font Yellowtail for the main header, "BoCa LonGa 2027", and Josefin Sans for other text;
	- equally accessible on mobile and desktop devices

3. On ending, record progress in `_progress.md` under a dated header, log finished work by x-ing it out in `_todos.md` and record any new to-do items in `_todos.md`.


## Structure

We will work on the conference website using the `confindex.qmd` file as a draft homepage. Once we have the conference website to take the place of the save-the-date page, we will substitute the `confindex.qmd` file for the `index.qmd` file. Until then we will keep it as a separate page.

```
bocalonga/
├─ index.qmd
├─ confindex.qmd
├─ accommodations.qmd
├─ schedule.qmd
├─ papers.qmd
├─ locations.qmd
├─ directions.qmd
├─ theme/
│  ├─ custom.scss
├─ images/
├─ text/
├─ _site/
```

- The `_site` folder holds the rendered site and is linked to a GitHub repository, `git@github.com:erauchway/bocalonga.git` It is possible owing to Dropbox peculiarity that the link to this repository may not adequately persist so please be sure to re-establish it as needed.
- The `theme` folder holds css and other common resources providing the site's appearance. 
- The `images` folder holds images—all images will be provided by me, and will either be photographs I have taken or images I have verified to be public domain. Generate no images. 
- The `text` folder holds drafts of all the text content for the pages and I will write it. Generate no text.
 
## Description of `confindex.qmd`
This file will contain Quarto code to produce an index page for the conference. It should have the conference name, "BoCa LonGa 2027", at the top in Yellowtail font. At the bottom, a credit note saying much what the credit note on the current, save-the-date index page says. 

In the body of the page should be a grid. Each square should be dimmed until mouseover. On mouseover they should appear in color and offer a one-word indication of what they link to: "Accommodations", "Directions", and so forth. 

For a start, the top left square in the grid should feature the image `routemaster.png` and link to the page defined by `directions.qmd` and the square in the top row second from left should feature the image `hyatt.png` and link to the page defined by `accommodations.qmd`. Other squares will be left unused for the moment.