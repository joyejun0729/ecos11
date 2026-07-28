import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MessageSquarePlus, Send, MessageCircle, Clock, User, AlertCircle, Loader2, Sparkles, Trash2 } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  content: string;
  createdAt: any;
}

export const CommunityBoard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Firestore real-time listener for latest posts (최신순)
  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const loadedPosts: Post[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              author: data.author || '익명 학생',
              content: data.content || '',
              createdAt: data.createdAt,
            };
          });
          setPosts(loadedPosts);
          setLoading(false);
        },
        (err) => {
          console.error('Firestore onSnapshot error:', err);
          setError('게시글을 불러오는 도중 오류가 발생했습니다.');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.error('Failed to subscribe to posts:', err);
      setError('게시판 연결에 실패했습니다.');
      setLoading(false);
    }
  }, []);

  // Handle post submit (Firestore 저장)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const postsRef = collection(db, 'posts');
      await addDoc(postsRef, {
        author: author.trim() || '익명 학생',
        content: content.trim(),
        createdAt: serverTimestamp(),
      });

      setContent('');
      // Do not clear author so user can post again easily
    } catch (err: any) {
      console.error('Failed to save post to Firestore:', err);
      setError('글 등록 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle post delete (Firestore 삭제)
  const handleDelete = async (postId: string) => {
    if (!window.confirm('작성한 의견을 삭제하시겠습니까?')) return;

    setDeletingId(postId);
    setError(null);

    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (err: any) {
      console.error('Failed to delete post from Firestore:', err);
      setError('의견 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setDeletingId(null);
    }
  };

  // Format date helper
  const formatDate = (createdAt: any) => {
    if (!createdAt) return '방금 전';
    try {
      let date: Date;
      if (createdAt instanceof Timestamp) {
        date = createdAt.toDate();
      } else if (typeof createdAt === 'object' && createdAt.seconds) {
        date = new Date(createdAt.seconds * 1000);
      } else {
        date = new Date(createdAt);
      }

      if (isNaN(date.getTime())) return '방금 전';

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);

      if (diffSec < 60) return '방금 전';
      if (diffMin < 60) return `${diffMin}분 전`;
      if (diffHour < 24) return `${diffHour}시간 전`;

      return `${date.getMonth() + 1}월 ${date.getDate()}일 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    } catch {
      return '방금 전';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner Header */}
      <div className="bg-emerald-600 rounded-[32px] p-6 sm:p-8 text-white shadow-xl shadow-emerald-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/80 border border-emerald-400/50 rounded-full text-xs font-bold text-white mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>실시간 클라우드 소통 공간</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            사용자 의견 & 그린캠퍼스 게시판
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
            분리수거 팁, 수거함 제보, 학교 환경 활동 아이디어 및 앱 사용 의견을 함께 나눠주세요! 등록된 글은 Firebase Firestore를 통해 실시간 공유됩니다.
          </p>
        </div>
      </div>

      {/* Write Input Card */}
      <div className="bg-white rounded-3xl border-2 border-emerald-50 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
          <MessageSquarePlus className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-lg">의견 / 팁 작성하기</h3>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="sm:w-1/3">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                작성자 (선택)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="예: 2학년 4반 김지원 또는 익명"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-emerald-100 rounded-2xl text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
              />
            </div>
            <div className="sm:w-2/3">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                의견 내용 <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="친환경 팁이나 서비스 개선 의견을 입력하세요..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-emerald-100 rounded-2xl text-xs sm:text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-2xl text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow-md shadow-emerald-200 cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>등록</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Board Post List Section */}
      <div className="bg-white rounded-3xl border-2 border-emerald-50 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-lg">게시판 목록</h3>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            총 {posts.length}개의 의견 (최신순)
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
            <p className="text-xs font-medium">Firestore에서 실시간 게시글을 불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <MessageSquarePlus className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-600">아직 등록된 게시글이 없습니다.</p>
            <p className="text-xs text-slate-400">위 입력창에 첫 친환경 의견이나 팁을 작성해 보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 bg-slate-50/80 hover:bg-emerald-50/40 rounded-2xl border border-slate-100 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center justify-center">
                      {post.author.charAt(0) || '익'}
                    </span>
                    <span className="font-bold text-xs text-slate-800">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingId === post.id}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="의견 삭제"
                      aria-label="의견 삭제"
                    >
                      {deletingId === post.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed pl-9 whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
