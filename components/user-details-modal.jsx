"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, Globe, MapPin, Building, User } from "lucide-react"

export function UserDetailsModal({ user, isOpen, onClose }) {
  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{user.name}</DialogTitle>
              <DialogDescription className="text-lg">@{user.username}</DialogDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              ID: {user.id}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg md:col-span-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <p className="text-sm text-muted-foreground">{user.website}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address
            </h3>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Street</p>
                  <p className="text-sm text-muted-foreground">{user.address.street}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Suite</p>
                  <p className="text-sm text-muted-foreground">{user.address.suite}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">City</p>
                  <p className="text-sm text-muted-foreground">{user.address.city}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Zipcode</p>
                  <p className="text-sm text-muted-foreground">{user.address.zipcode}</p>
                </div>
              </div>
              {user.address.geo && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-medium mb-2">Coordinates</p>
                  <p className="text-sm text-muted-foreground">
                    Lat: {user.address.geo.lat}, Lng: {user.address.geo.lng}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Company Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company
            </h3>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Company Name</p>
                  <p className="text-sm text-muted-foreground">{user.company.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Catchphrase</p>
                  <p className="text-sm text-muted-foreground italic">"{user.company.catchPhrase}"</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Business</p>
                  <p className="text-sm text-muted-foreground">{user.company.bs}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
