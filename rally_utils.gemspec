# -*- encoding: utf-8 -*-
$:.push('lib')
require "rally_utils/version"

Gem::Specification.new do |s|
  s.name = "rally_utils"
  s.version = RallyUtils::VERSION.dup
  s.date = "2012-08-08"
  s.summary = "Rally Developer Tools"
  s.email = "todo@project.com"
  s.homepage = "http://todo.project.com/"
  s.authors = ['Me Todo']

  s.description = <<-EOF
Rally Developer Tools
  EOF

  dependencies = [
      [:runtime, "uri-handler", ">= 1.0.2"],
  ]

  s.files = Dir['**/*']
  s.test_files = Dir['test/**/*'] + Dir['spec/**/*']
  s.executables = Dir['bin/*'].map { |f| File.basename(f) }
  s.require_paths = ["lib"]


  ## Make sure you can build the gem on older versions of RubyGems too:
  s.rubygems_version = "1.8.24"
  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.specification_version = 3 if s.respond_to? :specification_version

  dependencies.each do |type, name, version|
    if s.respond_to?("add_#{type}_dependency")
      s.send("add_#{type}_dependency", name, version)
    else
      s.add_dependency(name, version)
    end
  end
end
