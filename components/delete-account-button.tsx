"use client"

import { Button } from "@/components/ui/button"

export function DeleteAccountButton() {
  return (
    <Button
      variant="destructive"
      type="submit"
      onClick={(e) => {
        if (!confirm("Yakin mau hapus akun? Ini beneran permanen lho!")) {
          e.preventDefault()
        }
      }}
    >
      Hapus Akun Saya
    </Button>
  )
}