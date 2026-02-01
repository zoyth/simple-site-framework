// ABOUTME: Utilities for optional Radix UI integration
// ABOUTME: Provides basic fallbacks when Radix UI primitives are not installed

import * as React from 'react'

/**
 * Check if a Radix UI package is available
 */
export function hasRadixUI(packageName: string): boolean {
  try {
    require.resolve(packageName)
    return true
  } catch {
    return false
  }
}

/**
 * Get Radix Dialog components or fallback
 * Used by Modal component
 */
export function getDialogComponents() {
  if (hasRadixUI('@radix-ui/react-dialog')) {
    return require('@radix-ui/react-dialog')
  }

  // Fallback implementations
  const Root = ({ children, open, onOpenChange }: any) => {
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && open) {
          onOpenChange?.(false)
        }
      }
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [open, onOpenChange])

    return open ? <>{children}</> : null
  }

  const Portal = ({ children }: any) => <>{children}</>
  const Overlay = ({ children, asChild, forceMount, ...props }: any) =>
    asChild ? React.cloneElement(children, props) : <div {...props}>{children}</div>
  const Content = ({ children, asChild, forceMount, onEscapeKeyDown, ...props }: any) =>
    asChild ? React.cloneElement(children, props) : <div {...props}>{children}</div>
  const Title = ({ children, className, ...props }: any) => <h2 className={className} {...props}>{children}</h2>
  const Description = ({ children, className, ...props }: any) => <p className={className} {...props}>{children}</p>
  const Close = ({ children, className, ...props }: any) => <button className={className} {...props}>{children}</button>

  return { Root, Portal, Overlay, Content, Title, Description, Close }
}

/**
 * Get Radix Accordion components or fallback
 * Used by FAQAccordion component
 */
export function getAccordionComponents() {
  if (hasRadixUI('@radix-ui/react-accordion')) {
    return require('@radix-ui/react-accordion')
  }

  // Fallback implementations with basic functionality
  const Root = ({ children, type, defaultValue, collapsible, className }: any) => {
    const [openItems, setOpenItems] = React.useState<string[]>(
      type === 'multiple' ? (defaultValue || []) : (defaultValue ? [defaultValue] : [])
    )

    const toggleItem = (value: string) => {
      if (type === 'multiple') {
        setOpenItems(prev =>
          prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        )
      } else {
        setOpenItems(prev =>
          prev.includes(value) && collapsible ? [] : [value]
        )
      }
    }

    const context = { openItems, toggleItem }

    return (
      <AccordionContext.Provider value={context}>
        <div className={className}>{children}</div>
      </AccordionContext.Provider>
    )
  }

  const Item = ({ children, value, className }: any) => {
    return (
      <AccordionItemContext.Provider value={value}>
        <div className={className}>{children}</div>
      </AccordionItemContext.Provider>
    )
  }

  const Header = ({ children }: any) => <div>{children}</div>

  const Trigger = ({ children, className }: any) => {
    const { openItems, toggleItem } = React.useContext(AccordionContext)
    const value = React.useContext(AccordionItemContext)
    const isOpen = openItems.includes(value)

    return (
      <button
        className={className}
        onClick={() => toggleItem(value)}
        aria-expanded={isOpen}
      >
        {children}
      </button>
    )
  }

  const Content = ({ children, asChild, forceMount, className }: any) => {
    const { openItems } = React.useContext(AccordionContext)
    const value = React.useContext(AccordionItemContext)
    const isOpen = openItems.includes(value)

    if (!isOpen && !forceMount) return null

    if (asChild) {
      return React.cloneElement(children, { className })
    }

    return <div className={className}>{children}</div>
  }

  return { Root, Item, Header, Trigger, Content }
}

/**
 * Get Radix Tooltip components or fallback
 * Used by Button component
 */
export function getTooltipComponents() {
  if (hasRadixUI('@radix-ui/react-tooltip')) {
    return require('@radix-ui/react-tooltip')
  }

  // Fallback implementations
  const Provider = ({ children }: any) => <>{children}</>
  const Root = ({ children }: any) => <>{children}</>
  const Trigger = ({ children, asChild, ...props }: any) =>
    asChild ? React.cloneElement(children, props) : <div {...props}>{children}</div>
  const Portal = ({ children }: any) => <>{children}</>
  const Content = ({ children, className, sideOffset, ...props }: any) => {
    const [show, setShow] = React.useState(false)
    return show ? <div className={className} {...props}>{children}</div> : null
  }
  const Arrow = ({ className }: any) => null

  return { Provider, Root, Trigger, Portal, Content, Arrow }
}

/**
 * Get Radix Tabs components or fallback
 */
export function getTabsComponents() {
  if (hasRadixUI('@radix-ui/react-tabs')) {
    return require('@radix-ui/react-tabs')
  }

  // Fallback implementations
  const Root = ({ children, defaultValue, className }: any) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue)
    const context = { activeTab, setActiveTab }

    return (
      <TabsContext.Provider value={context}>
        <div className={className}>{children}</div>
      </TabsContext.Provider>
    )
  }

  const List = ({ children, className }: any) => <div className={className} role="tablist">{children}</div>

  const Trigger = ({ children, value, className }: any) => {
    const { activeTab, setActiveTab } = React.useContext(TabsContext)
    const isActive = activeTab === value

    return (
      <button
        className={className}
        onClick={() => setActiveTab(value)}
        role="tab"
        aria-selected={isActive}
      >
        {children}
      </button>
    )
  }

  const Content = ({ children, value, className }: any) => {
    const { activeTab } = React.useContext(TabsContext)
    if (activeTab !== value) return null

    return <div className={className} role="tabpanel">{children}</div>
  }

  return { Root, List, Trigger, Content }
}

/**
 * Get Radix Select components or fallback
 */
export function getSelectComponents() {
  if (hasRadixUI('@radix-ui/react-select')) {
    return require('@radix-ui/react-select')
  }

  // Fallback: basic native select
  const Root = ({ children, value, onValueChange }: any) => {
    const context = { value, onValueChange }
    return (
      <SelectContext.Provider value={context}>
        {children}
      </SelectContext.Provider>
    )
  }

  const Trigger = ({ children, className }: any) => {
    const { value, onValueChange } = React.useContext(SelectContext)
    return (
      <button className={className} type="button">
        {children}
      </button>
    )
  }

  const Value = ({ placeholder }: any) => {
    const { value } = React.useContext(SelectContext)
    return <span>{value || placeholder}</span>
  }

  const Icon = ({ children }: any) => <span>{children}</span>
  const Portal = ({ children }: any) => <>{children}</>
  const Content = ({ children }: any) => <div>{children}</div>
  const Viewport = ({ children }: any) => <div>{children}</div>
  const Item = ({ children, value, className }: any) => {
    const { onValueChange } = React.useContext(SelectContext)
    return (
      <button className={className} onClick={() => onValueChange(value)}>
        {children}
      </button>
    )
  }
  const ItemText = ({ children }: any) => <span>{children}</span>
  const ItemIndicator = ({ children }: any) => <span>{children}</span>

  return { Root, Trigger, Value, Icon, Portal, Content, Viewport, Item, ItemText, ItemIndicator }
}

// Context for fallback implementations
const AccordionContext = React.createContext<any>({})
const AccordionItemContext = React.createContext<any>(null)
const TabsContext = React.createContext<any>({})
const SelectContext = React.createContext<any>({})
