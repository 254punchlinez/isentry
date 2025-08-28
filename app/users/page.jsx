"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { usersApi } from "@/lib/api"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { UserForm } from "@/components/user-form"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import { SearchBar } from "@/components/search-bar"
import { UserDetailsModal } from "@/components/user-details-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { AlertCircle, Mail, Phone, Globe, MapPin, Plus, Edit, Trash2, Eye } from "lucide-react"

const userSearchFields = [
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "username", label: "Username" },
  { value: "phone", label: "Phone" },
  { value: "website", label: "Website" },
]

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deleteUser, setDeleteUser] = useState(null)
  const [viewingUser, setViewingUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchField, setSearchField] = useState("name")
  const queryClient = useQueryClient()

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll().then((res) => res.data),
  })

  const filteredUsers = useMemo(() => {
    if (!users || !searchTerm) return users

    return users.filter((user) => {
      const searchValue = searchTerm.toLowerCase()
      switch (searchField) {
        case "name":
          return user.name.toLowerCase().includes(searchValue)
        case "email":
          return user.email.toLowerCase().includes(searchValue)
        case "username":
          return user.username.toLowerCase().includes(searchValue)
        case "phone":
          return user.phone.toLowerCase().includes(searchValue)
        case "website":
          return user.website.toLowerCase().includes(searchValue)
        default:
          return user.name.toLowerCase().includes(searchValue)
      }
    })
  }, [users, searchTerm, searchField])

  const createUserMutation = useMutation({
    mutationFn: (userData) => usersApi.create(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setShowForm(false)
      toast({
        title: "Success",
        description: "User created successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      })
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }) => usersApi.update(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setEditingUser(null)
      toast({
        title: "Success",
        description: "User updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: (id) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setDeleteUser(null)
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    },
  })

  const handleCreateUser = (userData) => {
    createUserMutation.mutate(userData)
  }

  const handleUpdateUser = (userData) => {
    updateUserMutation.mutate({ id: editingUser.id, userData })
  }

  const handleDeleteUser = () => {
    if (deleteUser) {
      deleteUserMutation.mutate(deleteUser.id)
    }
  }

  const handleSearch = (term, field) => {
    setSearchTerm(term)
    setSearchField(field)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  if (showForm || editingUser) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavigation />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <UserForm
              user={editingUser}
              onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
              onCancel={() => {
                setShowForm(false)
                setEditingUser(null)
              }}
              isLoading={createUserMutation.isPending || updateUserMutation.isPending}
            />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Users Management</h1>
                <p className="text-muted-foreground">
                  Manage and view all users in the system. Data fetched from JSONPlaceholder API.
                </p>
              </div>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <SearchBar
                onSearch={handleSearch}
                onClear={handleClearSearch}
                searchFields={userSearchFields}
                placeholder="Search users..."
              />
              {searchTerm && (
                <div className="text-sm text-muted-foreground">
                  Found {filteredUsers?.length || 0} user(s) matching "{searchTerm}"
                </div>
              )}
            </div>

            {error && (
              <Card className="mb-6 border-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>Error loading users: {error.message}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : filteredUsers?.map((user) => (
                    <Card key={user.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{user.name}</CardTitle>
                            <CardDescription>@{user.username}</CardDescription>
                          </div>
                          <Badge variant="secondary">ID: {user.id}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{user.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            <span className="truncate">{user.website}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">
                              {user.address.city}, {user.address.zipcode}
                            </span>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setViewingUser(user)}
                              className="flex-1 gap-2"
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingUser(user)}
                              className="flex-1 gap-2"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteUser(user)}
                              className="flex-1 gap-2 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>

            {filteredUsers && filteredUsers.length === 0 && !isLoading && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm ? `No users found matching "${searchTerm}"` : "No users found."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      <UserDetailsModal user={viewingUser} isOpen={!!viewingUser} onClose={() => setViewingUser(null)} />

      <DeleteConfirmation
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete ${deleteUser?.name}? This action cannot be undone.`}
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  )
}
