import { Modal } from './Modal'

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  onConfirm: () => void
  onClose: () => void
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
            className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:brightness-110"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
