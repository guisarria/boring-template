"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQueryState } from "nuqs"
import { Button } from "@/components/ui/button"
import { SidebarGroup, useSidebar } from "@/components/ui/sidebar"
import {
  TreeExpander,
  TreeIcon,
  TreeLabel,
  TreeNode,
  TreeNodeContent,
  TreeNodeTrigger,
  TreeProvider,
  TreeView
} from "@/components/ui/tree"

type SidebarDataProps = {
  data: {
    navMain: {
      title: string
      url: string
      items: { title: string; url: string }[]
    }[]
  }
}

export function SidebarData({ data }: SidebarDataProps) {
  const [search] = useQueryState("search", { defaultValue: "" })
  const router = useRouter()

  const filteredData = data.navMain.filter((item) => {
    const bookMatches = item.title.toLowerCase().includes(search.toLowerCase())

    const pageMatches = item.items.some((page) =>
      page.title.toLowerCase().includes(search.toLowerCase())
    )

    return bookMatches || pageMatches
  })

  return (
    <SidebarGroup>
      <TreeProvider
        animateExpand={true}
        defaultExpandedIds={data.navMain.map((item) =>
          item.items.length >= 1 ? item.url : ""
        )}
        indent={20}
        multiSelect={false}
        selectable={false}
        showIcons={true}
        showLines={true}
      >
        <TreeView>
          {filteredData.map((item, index) => (
            <TreeNode
              isLast={index === filteredData.length - 1}
              key={item.url}
              level={0}
              nodeId={item.url}
            >
              <TreeNodeTrigger onDoubleClick={() => router.push(item.url)}>
                <TreeExpander hasChildren={item.items.length > 0} />
                <TreeIcon
                  className="text-amber-200"
                  hasChildren={item.items.length >= 0}
                />
                <TreeLabel className="text-muted-foreground">
                  {item.title}
                </TreeLabel>
              </TreeNodeTrigger>
              <TreeNodeContent
                className="text-muted-foreground"
                hasChildren={item.items.length > 0}
              >
                {item.items.map((i, idx) => (
                  <TreeNode
                    className="ml-1"
                    isLast={idx === item.items.length - 1}
                    key={i.url}
                    level={1}
                    nodeId={i.url}
                  >
                    <TreeNodeTrigger>
                      <Link className="ml-2 flex items-center" href={i.url}>
                        <TreeIcon
                          className="text-foreground/70"
                          hasChildren={false}
                        />
                        <TreeLabel>{i.title}</TreeLabel>
                      </Link>
                    </TreeNodeTrigger>
                  </TreeNode>
                ))}
              </TreeNodeContent>
            </TreeNode>
          ))}
        </TreeView>
      </TreeProvider>
    </SidebarGroup>
  )
}

export const SidebarLogo = () => {
  const { isMobile, setOpenMobile } = useSidebar()
  const router = useRouter()

  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false)

      return setTimeout(() => {
        router.push("/")
      }, 250)
    }
    return router.push("/")
  }
  return (
    <Button className="mb-1 py-5" onClick={handleClick} variant={"ghost"}>
      <p className="font-black font-serif text-cyan-400 text-lg">
        BETTER AUTH TEMPLATE
      </p>
    </Button>
  )
}
