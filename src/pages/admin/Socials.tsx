import { Facebook, Heart, Instagram, MessageCircle, Music2, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAdminData } from '@/context/AdminDataContext'
import type { SocialPlatformKey } from '@/data/seed/adminTypes'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminCard } from '@/components/admin/AdminCard'
import { StatCard } from '@/components/admin/StatCard'
import { AreaChart } from '@/components/admin/charts/AreaChart'
import { formatCompact, formatDelta, formatNumber, formatDate, round2 } from '@/lib/format'

const PLATFORM: Record<SocialPlatformKey, { color: string; Icon: LucideIcon }> = {
  instagram: { color: '#FF2E88', Icon: Instagram },
  facebook: { color: '#4A8CFF', Icon: Facebook },
  tiktok: { color: '#25E0D8', Icon: Music2 },
}

export function Socials() {
  const { data } = useAdminData()
  const { socials, posts, followerTrend } = data

  const totalFollowers = socials.reduce((s, p) => s + p.followers, 0)
  const totalReach = socials.reduce((s, p) => s + p.reach30d, 0)
  const avgEngagement = round2(
    socials.reduce((s, p) => s + p.engagementPct, 0) / socials.length,
  )
  const netNew =
    followerTrend.length > 1
      ? followerTrend[followerTrend.length - 1].value - followerTrend[0].value
      : 0

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <div>
      <AdminPageHeader
        title="Socials"
        subtitle="Reach, engagement and growth across every channel"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Followers"
          value={formatCompact(totalFollowers)}
          icon={Users}
          accent="#FF6A14"
        />
        <StatCard
          label="30-Day Reach"
          value={formatCompact(totalReach)}
          icon={Heart}
          accent="#FF2E88"
        />
        <StatCard
          label="Avg Engagement"
          value={`${avgEngagement}%`}
          icon={MessageCircle}
          accent="#25E0D8"
        />
        <StatCard
          label="New Followers · 30d"
          value={`+${formatNumber(netNew)}`}
          icon={Users}
          accent="#74B49A"
        />
      </div>

      {/* platform cards */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {socials.map((platform) => {
          const { color, Icon } = PLATFORM[platform.key]
          return (
            <div
              key={platform.key}
              className="rounded-2xl border border-bone/8 bg-ash p-5"
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid h-10 w-10 place-items-center rounded-xl"
                  style={{ backgroundColor: `${color}22`, color }}
                >
                  <Icon size={19} />
                </span>
                <div>
                  <p className="font-heading text-sm font-extrabold text-bone">
                    {platform.name}
                  </p>
                  <p className="font-sans text-xs text-smoke">
                    {platform.handle}
                  </p>
                </div>
              </div>
              <p className="mt-4 font-display text-4xl leading-none text-bone">
                {formatCompact(platform.followers)}
              </p>
              <p
                className="mt-1 font-heading text-xs font-extrabold"
                style={{ color }}
              >
                ▲ {formatDelta(platform.growthPct)} followers
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-bone/8 pt-3">
                <div>
                  <p className="font-heading text-[10px] font-extrabold uppercase tracking-ember text-smoke">
                    Engagement
                  </p>
                  <p className="font-heading text-lg font-extrabold text-bone">
                    {platform.engagementPct}%
                  </p>
                </div>
                <div>
                  <p className="font-heading text-[10px] font-extrabold uppercase tracking-ember text-smoke">
                    Reach 30d
                  </p>
                  <p className="font-heading text-lg font-extrabold text-bone">
                    {formatCompact(platform.reach30d)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4">
        <AdminCard title="Follower Growth" subtitle="Combined audience, last 30 days">
          <AreaChart
            data={followerTrend}
            color="#FF2E88"
            format={(v) => `${formatNumber(Math.round(v))} followers`}
          />
        </AdminCard>
      </div>

      {/* recent posts */}
      <div className="mt-4">
        <AdminCard title="Recent Posts" subtitle="Latest content performance">
          <ul className="space-y-3">
            {sortedPosts.map((post) => {
              const { color, Icon } = PLATFORM[post.platform]
              return (
                <li
                  key={post.id}
                  className="flex flex-col gap-3 rounded-xl bg-char/50 p-4 sm:flex-row sm:items-center"
                >
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                    style={{ backgroundColor: `${color}22`, color }}
                  >
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm text-bone">{post.caption}</p>
                    <p className="font-sans text-xs text-smoke">
                      {formatDate(post.date)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-5">
                    <span className="flex items-center gap-1.5 font-heading text-sm font-bold text-bone">
                      <Heart size={14} className="text-ember" />
                      {formatCompact(post.likes)}
                    </span>
                    <span className="flex items-center gap-1.5 font-heading text-sm font-bold text-bone">
                      <MessageCircle size={14} className="text-flare" />
                      {formatCompact(post.comments)}
                    </span>
                    <span className="hidden items-center gap-1.5 font-heading text-sm font-bold text-bone sm:flex">
                      <Users size={14} className="text-smoke" />
                      {formatCompact(post.reach)}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </AdminCard>
      </div>
    </div>
  )
}
