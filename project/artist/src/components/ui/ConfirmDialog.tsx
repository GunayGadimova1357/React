import { Modal } from './Modal'

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  onConfirm,
  onClose,
  loading = false,
}: {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  onConfirm: () => void
  onClose: () => void
  loading?: boolean
}) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="space-y-4">
        {description && (
          <p className="text-sm text-zinc-400">{description}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:brightness-110 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <div className="w-4 h-4 border border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin"></div>}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}