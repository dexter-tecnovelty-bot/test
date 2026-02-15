import Modal from './ui/Modal';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal = ({ isOpen, onClose }: VideoModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title="See Product Walkthrough">
    <div className="space-y-4">
      <p className="text-sm text-slate-700">
        Quick walkthrough of onboarding, analytics, and team workflows.
      </p>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
        <iframe
          className="block aspect-video w-full"
          src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
          title="Product walkthrough video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  </Modal>
);

export default VideoModal;
