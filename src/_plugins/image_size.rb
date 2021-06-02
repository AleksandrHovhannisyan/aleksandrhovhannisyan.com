require 'fastimage'

=begin
Algorithm by Mark Monteiro: https://stackoverflow.com/questions/53309750/jekyll-get-width-height-of-an-image-without-using-an-external-plugin/64452457#64452457.
Slightly modified for use on this site.
License: CC BY-SA 4.0 (per StackOverflow)
TODO: convert to gem
=end

module ImageSizeFilter
  def image_size(img_path, dimension = nil)
    size = FastImage.size(img_path, raise_on_failure: true)
    return size[0] if dimension == 'width'
    return size[1] if dimension == 'height'
    return size unless dimension
    raise 'Unrecognized image dimension: ' + dimension
  end
end

Liquid::Template.register_filter(ImageSizeFilter)
