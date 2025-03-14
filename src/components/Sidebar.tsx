import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CalculatorIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  CalendarIcon,
  GiftIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  HomeIcon,
  CurrencyPoundIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  BriefcaseIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { useState } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: NavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemName: string) => {
    if (!isCollapsed) {
      setExpandedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(itemName)) {
          newSet.delete(itemName);
        } else {
          newSet.add(itemName);
        }
        return newSet;
      });
    }
  };

  const navigationSections: NavSection[] = [
    {
      title: 'Main',
      items: [{ name: 'Home', href: '/', icon: HomeIcon }],
    },
    {
      title: 'Calculators',
      items: [
        {
          name: 'Tax Calculators',
          href: '#',
          icon: CalculatorIcon,
          children: [
            {
              name: 'PAYE Calculator',
              href: '/paye-calculator',
              icon: CurrencyPoundIcon,
            },
            {
              name: 'Period Tax Calculator',
              href: '/period-tax-calculator',
              icon: CalculatorIcon,
            },
            {
              name: t('navigation.comparison'),
              href: '/comparison',
              icon: ChartBarIcon,
            },
            {
              name: 'Car Benefit Calculator',
              href: '/car-benefit-calculator',
              icon: BriefcaseIcon,
            },
            {
              name: 'Dates Calculator',
              href: '/dates-calculator',
              icon: ClockIcon,
            },
          ],
        },
      ],
    },
    {
      title: 'References',
      items: [
        {
          name: 'Tax Codes Explained',
          href: '/tax-codes-explained',
          icon: DocumentTextIcon,
        },
        {
          name: t('navigation.taxYears'),
          href: '/tax-years',
          icon: CalendarIcon,
        },
        { name: 'Tax Guides', href: '/tax-guides', icon: AcademicCapIcon },
        { name: t('navigation.benefits'), href: '/benefits', icon: GiftIcon },
        {
          name: t('navigation.forms'),
          href: '/forms',
          icon: ClipboardDocumentListIcon,
        },
      ],
    },
  ];

  const NavItem = ({ item, depth = 0 }: { item: NavItem; depth?: number }) => {
    const isExpanded = expandedItems.has(item.name);
    const isActive = location.pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isChildActive = hasChildren && item.children?.some(child => location.pathname === child.href);

    if (isCollapsed && depth === 0) {
      return (
        <div className="relative group">
          <Link
            to={item.href === '#' ? (item.children?.[0]?.href || '#') : item.href}
            className={clsx(
              'flex items-center justify-center',
              'p-3 rounded-lg',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-govuk-blue/20',
              (isActive || isChildActive) ? 'bg-govuk-blue/10 text-govuk-blue' : 'text-gray-900 hover:bg-govuk-blue/5',
              'dark:(text-white hover:bg-govuk-blue/10)'
            )}
            onClick={onClose}
          >
            <item.icon className="h-5 w-5" />
          </Link>
          {hasChildren && (
            <div className="absolute left-full top-0 ml-2 hidden group-hover:block">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 w-48">
                {item.children.map((child) => (
                  <Link
                    key={child.name}
                    to={child.href}
                    className={clsx(
                      'flex items-center px-4 py-2',
                      'text-sm text-gray-700 dark:text-gray-300',
                      'hover:bg-govuk-blue/5 dark:hover:bg-govuk-blue/10'
                    )}
                    onClick={onClose}
                  >
                    <child.icon className="h-4 w-4 mr-2" />
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.name)}
            className={clsx(
              'w-full flex items-center justify-between',
              'p-3 rounded-lg text-sm font-medium',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-govuk-blue/20',
              (isActive || isChildActive) ? 'bg-govuk-blue/10 text-govuk-blue' : 'text-gray-900 hover:bg-govuk-blue/5',
              'dark:(text-white hover:bg-govuk-blue/10)'
            )}
            style={{ paddingLeft: `${depth * 1}rem` }}
          >
            <span className="flex items-center">
              <item.icon className="h-5 w-5 mr-3" />
              {!isCollapsed && item.name}
            </span>
            {!isCollapsed && (
              isExpanded ? (
                <ChevronDownIcon className="h-5 w-5" />
              ) : (
                <ChevronRightIcon className="h-5 w-5" />
              )
            )}
          </button>
        ) : (
          <Link
            to={item.href}
            className={clsx(
              'flex items-center',
              'p-3 rounded-lg text-sm font-medium',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-govuk-blue/20',
              isActive ? 'bg-govuk-blue/10 text-govuk-blue' : 'text-gray-900 hover:bg-govuk-blue/5',
              'dark:(text-white hover:bg-govuk-blue/10)'
            )}
            style={{ paddingLeft: `${depth * 1}rem` }}
            onClick={onClose}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {!isCollapsed && item.name}
          </Link>
        )}

        {hasChildren && isExpanded && !isCollapsed && (
          <div className="ml-4 space-y-1">
            {item.children.map((child) => (
              <NavItem key={child.name} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-50',
          'h-full bg-white dark:bg-gray-800',
          'border-r border-gray-200 dark:border-gray-700',
          'transition-all duration-300 ease-in-out',
          'overflow-y-auto',
          {
            'w-64': !isCollapsed,
            'w-16': isCollapsed,
            'translate-x-0': isOpen,
            '-translate-x-full': !isOpen
          }
        )}
        aria-label="Sidebar navigation"
      >
        <div className="p-4 space-y-8">
          {/* Collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={clsx(
              'absolute top-4 right-4',
              'p-2 rounded-lg',
              'text-gray-500 hover:text-gray-900',
              'dark:text-gray-400 dark:hover:text-white',
              'hover:bg-gray-100 dark:hover:bg-gray-700',
              'focus:outline-none focus:ring-2 focus:ring-govuk-blue/20',
              'transition-colors duration-200'
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronDoubleRightIcon className="h-5 w-5" />
            ) : (
              <ChevronDoubleLeftIcon className="h-5 w-5" />
            )}
          </button>

          {navigationSections.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <h2 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {section.title}
                </h2>
              )}
              <nav className="mt-2 space-y-1">
                {section.items.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}