"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Check, CheckCheck, Trophy, AlertCircle, Info, X, Trash2 } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "warning" | "info" | "achievement"
  title: string
  message: string
  time: string
  read: boolean
}

const defaultNotifications: Notification[] = [
  {
    id: "1",
    type: "achievement",
    title: "Thành tựu mới!",
    message: "Bạn đã hoàn thành streak 7 ngày liên tiếp",
    time: "5 phút trước",
    read: false,
  },
  {
    id: "2",
    type: "success",
    title: "Điểm cao mới",
    message: "Bạn đạt 91% trong bài Java Spring - Cao nhất từ trước đến nay!",
    time: "2 giờ trước",
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "Bộ phỏng vấn mới",
    message: "Chúng tôi vừa thêm bộ phỏng vấn Rust cho bạn khám phá",
    time: "1 ngày trước",
    read: false,
  },
  {
    id: "4",
    type: "warning",
    title: "Nhắc nhở luyện tập",
    message: "Bạn chưa luyện tập trong 3 ngày. Hãy quay lại để giữ streak!",
    time: "3 ngày trước",
    read: true,
  },
  {
    id: "5",
    type: "success",
    title: "Báo cáo tuần",
    message: "Bạn đã luyện tập 5 buổi tuần này với điểm TB 82%",
    time: "5 ngày trước",
    read: true,
  },
]

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Check className="h-4 w-4 text-success" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-primary" />
      case "achievement":
        return <Trophy className="h-4 w-4 text-yellow-500" />
    }
  }

  const getBgColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-success/10"
      case "warning":
        return "bg-yellow-500/10"
      case "info":
        return "bg-primary/10"
      case "achievement":
        return "bg-yellow-500/10"
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 hover:bg-primary/10">
          <Bell className="h-4 w-4 text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Thông báo</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 glass border-border" align="end">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground">Thông báo</CardTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-primary/10"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Đọc tất cả
            </Button>
          )}
        </CardHeader>
        <ScrollArea className="h-[320px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Không có thông báo mới</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group relative p-3 rounded-lg transition-colors cursor-pointer ${
                    notification.read ? "hover:bg-secondary/30" : "bg-primary/5 hover:bg-primary/10"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div
                      className={`h-8 w-8 rounded-lg ${getBgColor(notification.type)} flex items-center justify-center shrink-0`}
                    >
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm font-medium ${notification.read ? "text-muted-foreground" : "text-foreground"}`}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(notification.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <div className="p-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground hover:text-foreground hover:bg-primary/10"
              onClick={clearAll}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Xóa tất cả thông báo
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
