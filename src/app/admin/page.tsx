import './page.css'
import promotions from '@/app/(site)/promotion/data.json'
import reviews from '@/app/(site)/review/data.json'
import articles from '@/app/(site)/article/data.json'
import services from '@/app/(site)/services/data.json'

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Articles',
      value: articles.length,
      icon: '📄',
      link: '/admin/articles',
    },
    {
      label: 'Promotions',
      value: promotions.length,
      icon: '🎉',
      link: '/admin/promotions',
    },
    {
      label: 'Reviews',
      value: reviews.length,
      icon: '⭐',
      link: '/admin/reviews',
    },
    {
      label: 'Services',
      value: services.length,
      icon: '💉',
      link: '/admin/services',
    },
  ]

  const recent = [
    {
      type: 'Article',
      action: 'Edited',
      title: articles[0]?.title || 'New Article',
      time: '1 hour ago',
      icon: '📄',
    },
    {
      type: 'Promotion',
      action: 'Published',
      title: promotions[0]?.title || 'New Promotion',
      time: '2 hours ago',
      icon: '🎉',
    },
    {
      type: 'Review',
      action: 'Approved',
      title: reviews[0]?.title || 'New Review',
      time: '3 hours ago',
      icon: '⭐',
    },
    {
      type: 'Service',
      action: 'Updated',
      title: services[0]?.title || services[0]?.name || 'New Service',
      time: '5 hours ago',
      icon: '💉',
    },
  ]

  return (
    <section className="admin-dashboard">
      {/* Header */}
      <div className="admin-dashboard-header">
        <div className="admin-dashboard-branding">
          <img
            src="/logo/Caroline-Clinic-Logo-noBG-Text.svg"
            alt="Caroline Clinic"
            className="admin-dashboard-logo"
          />
          <div>
            <div className="admin-dashboard-title">
              Caroline Clinic Admin Dashboard
            </div>
            <div className="admin-dashboard-welcome">Welcome back, Admin!</div>
          </div>
        </div>
        <div className="admin-dashboard-status">
          <span className="online-dot" /> Online
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-dashboard-actions">
        {stats.map((item) => (
          <a
            key={item.label}
            href={item.link}
            className="admin-dashboard-action-card"
          >
            <span className="admin-dashboard-action-icon">{item.icon}</span>
            <span className="admin-dashboard-action-value">{item.value}</span>
            <span className="admin-dashboard-action-label">{item.label}</span>
          </a>
        ))}
      </div>

      {/* Main content split */}
      <div className="admin-dashboard-main">
        {/* Recent Activity */}
        <div className="admin-dashboard-activity">
          <h3>Recent Activity</h3>
          <ul>
            {recent.map((item, idx) => (
              <li key={idx}>
                <span className="activity-type">{item.icon}</span>
                <span className="activity-label">
                  <b>{item.type}</b> {item.action}: <span>{item.title}</span>
                </span>
                <span className="activity-time">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Help & Info */}
        <div className="admin-dashboard-help">
          <h3>Need Help?</h3>
          <ul>
            <li>
              Use the left sidebar to navigate to different management areas.
            </li>
            <li>
              For urgent support, contact{' '}
              <a href="mailto:support@carolineclinic.com">
                support@carolineclinic.com
              </a>
            </li>
            <li>All activity is tracked for security.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
