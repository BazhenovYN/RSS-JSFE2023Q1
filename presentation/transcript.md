# Scalable vector graphics (SVG)
Hello everyone! In this video I will tell you about such technology as SVG. If you are a middle or senior front-end developer, you probably won't learn anything new. But if you are a junior developer, you will find this video useful.

So, Scalable Vector Graphics, SVG, is an XML language, which can be used to draw vector graphics. In other words, SVGs are graphics built using vectors. A vector is an element with a specific size and direction. By using SVGs, you get images that can be scaled to any .

## Raster vs vector
This slide illustrates the difference between raster and vector images. The raster image is composed of a fixed set of pixels, while the vector image is composed of a fixed set of shapes. SVGs are able to maintain image quality as they are scaled up or down. For example, if you keep zooming in on the PNG image, you'll notice that the quality starts to degrade at some point. With more complex pixel-based graphics, the degradation is much faster. SVGs, on the other hand, look good at any resolution.

## How to create an SVG file
How do we create an SVG file? There are two approaches. First, you can create SVGs like any other graphics – by using a design program and saving the file out as an SVG. Here are some of the software that allows you to create SVG files. 

Another approach is to create an SVG file in a text editor. We simply create a new file with the .svg extension, and then we can create graphics inside our SVG. Let's take a closer look at this approach. 

## Basic shapes
There are several basic shapes used for most SVG drawing. To insert a shape, you create an element in the document. Different elements correspond to different shapes and take different parameters to describe the size and position of those shapes. The purpose of these shapes is fairly obvious from their names.

Some basic shapes are shown in this example.

## Path comands
Another shape that is often used in SVG is Path. The "path" element is the most powerful element in the SVG library of basic shapes. It can be used to create lines, curves, arcs, and more. A good understanding of paths is important when drawing SVGs. While creating complex paths using an XML editor or text editor is not recommended, understanding how they work will allow to identify and repair display issues in SVGs. The shape of a "path" element is defined by one parameter: d. The d attribute contains a series of commands and parameters used by those commands. Each of the commands is instantiated by a specific letter. All of the commands also come in two variants. An uppercase letter specifies absolute coordinates on the page, and a lowercase letter specifies relative coordinates. The shape created by a "path" element consists of straight and curved lines or arcs that are drawn sequentially from point to point. The commands available for drawing inside "path" are shown on this slide. 

Using these commands, we can draw such a shape. The creation of the shape starts from the point (10, 110). It is marked with a red dot. And then all points of this shape are connected by straight lines. 

## How to embed SVG into html
OK, now let's talk about how to embed an SVG into HTML. There are several approaches, which I have divided into 3 groups.

### Embedding SVG as images
The first is embedding SVG as images. In my opinion, this is the easiest way. But it has a serious disadvantage - we can't style our SVG image. Let's take a look at each approach.

1. Using an img-tag
The first is using the "img" tag. It has a syntax that is similar to how we embed other image formats like PNG, JPEG and GIF. In this case, we can see that styling of the element (fill property) does not work. 

2. Using a CSS property background-image
Next, SVGs can be referenced from CSS using the url() function. As with the "img" element, SVGs in background images do not support styles or interactivity.

3. Using a CSS property mask-image
With the mask property you create a mask that is applied to an element. Everywhere the mask is opaque, or solid, the underlying image shows through. Where it’s transparent, the underlying image is masked out, or hidden. The syntax for a CSS mask-image is similar to background-image. But in this case, stylization becomes available to us. For example, we can change the color on hover. It would work something like this.

### Embedding SVG as inline element
Let's take another approach. SVG can be inlined directly into HTML, rather than referenced as a separate file. This allows CSS on the HTML page to style the SVG elements.

1. Using inline SVG in HTML5
We can embed the SVG element directly into the HTML. Of course, this construction makes the code more difficult to read and increases its size, but it allows very flexible styling of the SVG element. 

2. Using an SVG sprites
Using an SVG sprites has the same advantages and disadvantages. 

### Embedding SVG with object, embed, iframe tags
In the last group, I have allocated the use of object, embed, iframe tags. These tags are currently deprecated and are not recommended for use. 

## Simple and very graceful
SVG technology is a simple and very graceful tool that opens a wide range of possibilities for creating beautiful and interactive web elements. It allows us to easily and flexibly implement ideas and bring creativity to our projects. 

## Thank you
I hope this video was helpful to you. Thank you very much for your attention. Bye! Bye!
