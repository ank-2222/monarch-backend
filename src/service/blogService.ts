import { Blog, IBlog } from "../models/Blog";
import { Admin } from "../models/Admin";
import ErrorHandler from "../utils/errors.handler";

export class BlogService {
  async createBlog(data: IBlog): Promise<IBlog> {
    // Check if a blog with the same title exists
    const existingBlog = await Blog.findOne({ title: data.title });
    if (existingBlog) {
      throw new Error("A blog with this title already exists.");
    }

    const blog = new Blog(data);
    return await blog.save();
  }

  async getBlogs(): Promise<IBlog[]> {
    return await Blog.find().populate("author", "name email");
  }

  async getBlogById(blogId: string): Promise<IBlog | null> {
    return await Blog.findById(blogId).populate("author", "name email");
  }

  async updateBlog(blogId: string, updates: Partial<IBlog>): Promise<IBlog | null> {
    const existingBlog = await Blog.findById(blogId);

    if (!existingBlog) {
        throw new Error("Blog not found");
    }

    const mergedUpdates = {
        ...existingBlog.toObject(),
        ...updates,
        seo: {
            ...existingBlog.seo, 
            ...updates.seo,
        },
    };

    return await Blog.findByIdAndUpdate(
        blogId,
        { $set: mergedUpdates },
        { new: true, runValidators: true }
    );
}


  async deleteBlog(blogId: string): Promise<string> {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new ErrorHandler({ message: "Blog not found", message_code: "BLOG_NOT_FOUND" });
    }
    await blog.deleteOne();
    return "Blog deleted successfully";
  }

  async togglePublish(blogId: string, status: "draft" | "published"): Promise<IBlog | null> {
    return await Blog.findByIdAndUpdate(blogId, { status }, { new: true });
  }

 
  

}
