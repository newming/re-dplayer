import utils from './utils';

class SettingBox {
    constructor (player) {
        this.player = player;

        this.player.template.mask.addEventListener('click', () => {
            this.hide();
        });
        this.player.template.settingButton.addEventListener('click', () => {
            this.show();
        });

        // loop
        this.loop = this.player.options.loop;
        this.player.template.loopToggle.checked = this.loop;
        this.player.template.loop.addEventListener('click', () => {
            this.player.template.loopToggle.checked = !this.player.template.loopToggle.checked;
            if (this.player.template.loopToggle.checked) {
                this.loop = true;
            }
            else {
                this.loop = false;
            }
            console.log(this.player.events);
            this.hide();
        });
        // continuous 连续播放
        this.continuous = this.player.options.continuous;
        this.player.template.continuousToggle.checked = this.continuous;
        this.player.template.continuous.addEventListener('click', () => {
            this.player.template.continuousToggle.checked = !this.player.template.continuousToggle.checked;
            if (this.player.template.continuousToggle.checked) {
                this.continuous = true;
            }
            else {
                this.continuous = false;
            }
            this.player.events.trigger('continuous_change', this.continuous);
            this.hide();
        });
        // show danmaku
        this.showDanmaku = this.player.user.get('danmaku');
        if (!this.showDanmaku) {
            this.player.danmaku && this.player.danmaku.hide();
        }
        this.player.template.showDanmakuToggle.checked = this.showDanmaku;
        this.player.template.showDanmaku.addEventListener('click', () => {
            this.player.template.showDanmakuToggle.checked = !this.player.template.showDanmakuToggle.checked;
            if (this.player.template.showDanmakuToggle.checked) {
                this.showDanmaku = true;
                this.player.danmaku.show();
            }
            else {
                this.showDanmaku = false;
                this.player.danmaku.hide();
            }
            this.player.user.set('danmaku', this.showDanmaku ? 1 : 0);
            this.hide();
        });

        // unlimit danmaku
        this.unlimitDanmaku = this.player.user.get('unlimited');
        this.player.template.unlimitDanmakuToggle.checked = this.unlimitDanmaku;
        this.player.template.unlimitDanmaku.addEventListener('click', () => {
            this.player.template.unlimitDanmakuToggle.checked = !this.player.template.unlimitDanmakuToggle.checked;
            if (this.player.template.unlimitDanmakuToggle.checked) {
                this.unlimitDanmaku = true;
                this.player.danmaku.unlimit(true);
            }
            else {
                this.unlimitDanmaku = false;
                this.player.danmaku.unlimit(false);
            }
            this.player.user.set('unlimited', this.unlimitDanmaku ? 1 : 0);
            this.hide();
        });

        // speed
        this.player.template.speed.addEventListener('click', () => {
            this.player.template.settingBox.classList.add('dplayer-setting-box-narrow');
            this.player.template.settingBox.classList.add('dplayer-setting-box-speed');
        });
        for (let i = 0; i < this.player.template.speedItem.length; i++) {
            this.player.template.speedItem[i].addEventListener('click', () => {
                this.player.video.playbackRate = this.player.template.speedItem[i].dataset.speed;
                this.setSpeedSelect(i);
                this.hide();
            });
        }

        // danmaku opacity
        if (this.player.danmaku) {
            const dWidth = 130;
            this.player.on('danmaku_opacity', (percentage) => {
                this.player.bar.set('danmaku', percentage, 'width');
                this.player.user.set('opacity', percentage);
            });
            this.player.danmaku.opacity(this.player.user.get('opacity'));

            const danmakuMove = (event) => {
                const e = event || window.event;
                let percentage = (e.clientX - utils.getElementViewLeft(this.player.template.danmakuOpacityBarWrap)) / dWidth;
                percentage = Math.max(percentage, 0);
                percentage = Math.min(percentage, 1);
                this.player.danmaku.opacity(percentage);
            };
            const danmakuUp = () => {
                document.removeEventListener('mouseup', danmakuUp);
                document.removeEventListener('mousemove', danmakuMove);
                this.player.template.danmakuOpacityBox.classList.remove('dplayer-setting-danmaku-active');
            };

            this.player.template.danmakuOpacityBarWrapWrap.addEventListener('click', (event) => {
                const e = event || window.event;
                let percentage = (e.clientX - utils.getElementViewLeft(this.player.template.danmakuOpacityBarWrap)) / dWidth;
                percentage = Math.max(percentage, 0);
                percentage = Math.min(percentage, 1);
                this.player.danmaku.opacity(percentage);
            });
            this.player.template.danmakuOpacityBarWrapWrap.addEventListener('mousedown', () => {
                document.addEventListener('mousemove', danmakuMove);
                document.addEventListener('mouseup', danmakuUp);
                this.player.template.danmakuOpacityBox.classList.add('dplayer-setting-danmaku-active');
            });
        }

        // quality switch
        this.player.template.qualityButton.addEventListener('click', () => {
            if (this.player.template.qualityMask.classList.contains('dplayer-quality-mask-show')) {
                this.player.template.qualityMask.classList.remove('dplayer-quality-mask-show');
            } else {
                this.player.template.settingBox.classList.remove('dplayer-setting-box-open'); // 将设置的box关闭
                this.player.template.qualityMask.classList.add('dplayer-quality-mask-show');
            }
        });
    }

    hide () {
        this.player.template.settingBox.classList.remove('dplayer-setting-box-open');
        this.player.template.mask.classList.remove('dplayer-mask-show');
        setTimeout(() => {
            this.player.template.settingBox.classList.remove('dplayer-setting-box-narrow');
            this.player.template.settingBox.classList.remove('dplayer-setting-box-speed');
        }, 300);
        if (this.player.template.qualityMask.classList.contains('dplayer-quality-mask-show')) {
            this.player.template.qualityMask.classList.remove('dplayer-quality-mask-show');
        }
        this.player.controller.disableAutoHide = false;
    }

    show () {
        this.player.template.qualityMask.classList.remove('dplayer-quality-mask-show'); // 将画质切换关闭
        this.player.template.settingBox.classList.add('dplayer-setting-box-open');
        this.player.template.mask.classList.add('dplayer-mask-show');

        this.player.controller.disableAutoHide = true;
    }
    // 设置选中 speed 样式
    setSpeedSelect (index) {
        for (let i = 0, len = this.player.template.speedItem.length; i < len; i++) {
            if (i === index) {
                this.player.template.speedItem[i].classList.add('select');
            } else {
                this.player.template.speedItem[i].classList.remove('select');
            }
        }
    }
}

module.exports = SettingBox;