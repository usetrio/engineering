require 'fileutils'

module Jekyll
    class PostsContentSync
        attr_accessor :site

        def initialize(site)
            @site = site
        end

        def posts_upload_path
            '_posts/uploads'
        end

        def posts_upload_files
            FileUtils.cd(posts_upload_path) do
                Dir.glob(all_files_glob_matcher).select { |file_path| File.file?(file_path) }
            end
        end

        def root_upload_path
            'uploads'
        end

        def root_upload_files
            FileUtils.cd(root_upload_path) do
                Dir.glob(all_files_glob_matcher).select { |file_path| File.file?(file_path) }
            end
        end

        def missing_root_upload_files
            posts_upload_files - root_upload_files
        end

        def extra_root_upload_files
            root_upload_files - posts_upload_files
        end

        def copy_missing_root_upload_files
            missing_root_upload_files.each do |file_path|
                source_path = File.join(posts_upload_path, file_path)
                target_path = File.join(root_upload_path, file_path)
                create_recursive_folders_if_needed(target_path)
                FileUtils.cp_r(source_path, target_path, preserve: true, verbose: true)
            end
        end

        def remove_extra_root_upload_files
            extra_root_upload_files.each do |file_path|
                target_path = File.join(root_upload_path, file_path)
                FileUtils.rm(target_path, verbose: true)
                dir_path, file_name = File.split(target_path)
                dir_path_files = Dir.glob(File.join(dir_path, all_files_glob_matcher))
                FileUtils.rm_r(dir_path, verbose: true) if dir_path_files.size.zero?
            end
        end

        def run
            copy_missing_root_upload_files
            remove_extra_root_upload_files
        end

        protected

        def create_recursive_folders_if_needed(file_path, remove_file_from_path: true)
            dir_path =
                if remove_file_from_path
                    dir_path, _ = File.split(file_path)
                    dir_path
                else
                    file_path
                end
            split_dir_path = dir_path.split(File::SEPARATOR)
            split_dir_path.reduce('') do |abs_path, dir_name|
                dir_path = abs_path.blank? ? dir_name : File.join(abs_path, dir_name)
                dir_path.tap { |dir_path| FileUtils.mkdir_p(dir_path, verbose: true) }
            end
        end

        private

        def all_files_glob_matcher
            File.join('**', '*')
        end
    end
end

Jekyll::Hooks.register(:site, :after_init) do |site|
    content_manager = Jekyll::PostsContentSync.new(site)
    content_manager.run
end