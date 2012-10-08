require 'date'

PRUNE_DAYS = 14
prune_date = Date.today - PRUNE_DAYS

branches = `git branch -a | grep crazytrain/`.split /\n/
branch_prune_count = 0
branches.each do |branch|
  branch_date = Date.parse `git log -1 #{$branch} --format=%ci`

  puts "#{branch_date} #{branch}"
  if branch_date < prune_date
    system "git push crazytrain :${branch}"
    branch_prune_count = branch_prune_count + 1
  end
end

puts "#{branch_prune_count} branches removed"
